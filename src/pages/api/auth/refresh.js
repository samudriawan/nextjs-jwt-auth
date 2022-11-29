import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
	post: refresh,
});

async function refresh(req, res) {
	const { method, cookies } = req;
	// console.log('refresh: ', cookies);

	if (method === 'POST') {
		const refreshToken = cookies['jwt'] || null;
		if (!refreshToken) return res.status(401).send('token not found');

		let payload = null;
		try {
			payload = jwt.verify(
				refreshToken,
				process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY
			);

			const newAccessToken = jwt.sign(
				{ email: payload.email },
				process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY,
				{ expiresIn: '1h' }
			);

			const newRefreshToken = jwt.sign(
				{ email: payload.email },
				process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
				{ expiresIn: '7d' }
			);

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

			return res.status(200).json({ newAccessToken });
		} catch (err) {
			// refresh token expired
			if (err.name === 'TokenExpiredError')
				return res.status(403).json(err.message);

			return res.status(500).json(err);
		}
	} else {
		return res.status(500).send('method not allowed');
	}
}
