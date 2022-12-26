// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../../lib/prisma';
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
	post: login,
});

async function login(req, res) {
	const { email, password } = req.body;
	const { method } = req;

	// only accept POST method
	if (method !== 'POST')
		return res.status(500).json('Method is not supported.');

	// get user data
	const foundUser = await prisma.user.findUnique({ where: { email } });

	// user not found
	if (!foundUser)
		return res.status(400).json({ success: false, msg: 'Email did not exist' });

	// compare password from client with hash data
	const passwordValid = await bcrypt.compare(password, foundUser.hash);

	if (!passwordValid)
		return res
			.status(401)
			.json({ success: false, msg: 'Password is not correct.' });

	// create JWTs
	const accessToken = jwt.sign(
		{ email: foundUser.email },
		process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY,
		{ expiresIn: '1h' }
	);
	const refreshToken = jwt.sign(
		{ email: foundUser.email },
		process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
		{ expiresIn: '7d' }
	);

	// add newly created refresh token to DB
	const result = await prisma.user.update({
		where: { email: foundUser.email },
		data: { refreshToken },
	});

	// create httpOnly secure cookies with refresh token
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

	// send user email and access token to user
	res.json({
		success: true,
		email: foundUser.email,
		token: accessToken,
	});
}
