// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import users from '../../../data/db.json';

export default async function handler(req, res) {
	const { email, password } = req.body;
	const { method } = req;

	// only accept POST method
	if (method !== 'POST')
		return res.status(500).json('Method is not supported.');

	// get user data
	const user = users.find((x) => x.email === email);

	// user not found
	if (!user)
		return res.status(400).json({ success: false, msg: 'User did not exist' });

	// compare password from client with hash data
	const passwordValid = await bcrypt.compare(password, user.hash);

	if (!passwordValid)
		return res
			.status(400)
			.json({ success: false, msg: 'Password is not correct.' });

	const accessToken = jwt.sign(
		{ email: user.email },
		process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY,
		{ expiresIn: '1h' }
	);

	const refreshToken = jwt.sign(
		{ email: user.email },
		process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
		{ expiresIn: '7d' }
	);

	res.setHeader(
		'Set-Cookie',
		cookie.serialize('jwt', refreshToken, {
			httpOnly: true, // accessible only by web server
			secure: true, // https
			sameSite: 'none', // cross-site cookie
			maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expire, set to match refresh token
			path: '/',
		})
	);

	return res.json({
		success: true,
		email: user.email,
		token: accessToken,
	});
}
