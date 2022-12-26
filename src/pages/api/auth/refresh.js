import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { apiHandler } from '../../../helpers/api/api-handler';
import prisma from '../../../lib/prisma';

export default apiHandler({
	post: refresh,
});

async function refresh(req, res) {
	const { method, cookies } = req;

	if (method === 'POST') {
		const refreshTokenCookies = cookies.jwt;
		if (!refreshTokenCookies) return res.status(401).send('token not found');

		const foundUser = await prisma.user.findFirst({
			where: {
				refreshToken: refreshTokenCookies,
			},
		});

		// user with refresh token from cookies is not found in db,
		// which means refresh token is an old token and reused
		if (!foundUser) {
			jwt.verify(
				refreshTokenCookies,
				process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
				async (err, decoded) => {
					if (err) return res.status(403).end();

					// find user associate with the token
					// and delete all stored refresh token in db from that user
					const hackedUser = await prisma.user.update({
						where: { email: decoded.email },
						data: { refreshToken: '' },
					});
					// console.log('hacked User: ', hackedUser);
				}
			);

			return res.status(403).end();
		}

		// delete refresh token in db which match the refresh token from cookies
		foundUser.refreshToken = foundUser.refreshToken.replace(
			refreshTokenCookies,
			''
		);

		// evaluate refresh token
		jwt.verify(
			refreshTokenCookies,
			process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
			async (err, decoded) => {
				if (err) {
					// refresh token expired
					const removeToken = await prisma.user.update({
						where: { email: foundUser.email },
						data: {
							refreshToken: '',
						},
					});
					// console.log('removed: ', removeToken);
					return res.status(403).end();
				}

				// email from refresh token is not match with in the user
				if (err || foundUser.email !== decoded.email)
					return res.status(403).end();

				// refresh token still valid
				const newAccessToken = jwt.sign(
					{ email: decoded.email },
					process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY,
					{ expiresIn: '1h' }
				);

				const newRefreshToken = jwt.sign(
					{ email: decoded.email },
					process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
					{ expiresIn: '7d' }
				);

				// saving new refresh token to current user
				foundUser.refreshToken = newRefreshToken;
				const updated = await prisma.user.update({
					where: { email: decoded.email },
					data: foundUser,
				});
				// console.log('saved: ', updated);

				res.setHeader(
					'Set-Cookie',
					cookie.serialize('jwt', newRefreshToken, {
						httpOnly: true, // accessible only by web server
						secure: true, // https
						sameSite: 'None', // cross-site cookie
						maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expire, set to match refresh token
						path: '/',
					})
				);

				res.json({ newAccessToken });
			}
		);
	} else {
		return res.status(500).send('method not allowed');
	}
}
