import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { apiHandler } from '../../../helpers/api/api-handler';
import User from '../../../model/User';

export default apiHandler({
	post: refresh,
});

async function refresh(req, res) {
	const { method, cookies } = req;

	if (method === 'POST') {
		const refreshToken = cookies.jwt;
		if (!refreshToken) return res.status(401).send('token not found');

		const foundUser = await User.findOne({
			refresh_token: refreshToken,
		}).exec();

		// user with refresh token from cookies is not found in db,
		// which means refresh token is an old token and reused
		if (!foundUser) {
			jwt.verify(
				refreshToken,
				process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
				async (err, decoded) => {
					if (err) return res.status(403).end();

					// find user associate with the token
					// and delete all stored refresh token in db from that user
					const hackedUser = await User.findOne({
						email: decoded.email,
					}).exec();
					hackedUser.refresh_token = [];
					await hackedUser.save();
				}
			);

			return res.status(403).end();
		}

		// delete refresh token in db which match the refresh token from cookies
		const newRefreshTokenArray = foundUser.refresh_token.filter(
			(rt) => rt !== refreshToken
		);

		// evaluate refresh token
		jwt.verify(
			refreshToken,
			process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
			async (err, decoded) => {
				if (err) {
					// refresh token expired
					foundUser.refresh_token = [...newRefreshTokenArray];
					await foundUser.save();
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
				foundUser.refresh_token = [...newRefreshTokenArray, newRefreshToken];
				await foundUser.save();

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
