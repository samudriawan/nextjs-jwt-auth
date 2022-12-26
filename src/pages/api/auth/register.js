// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import prisma from '../../../lib/prisma';
import { apiHandler } from '../../../helpers/api/api-handler';

export default apiHandler({
	post: register,
});

async function register(req, res) {
	const {
		method,
		body: { email, password },
	} = req;
	const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;

	// only accept POST method
	if (method !== 'POST')
		return res.status(500).json('Method is not supported.');

	// validate the user input
	const pwdSanitize = password.trim() || '';
	const emailSanitize = email.trim() || '';

	emailSanitize.match(regexEmail) ? emailSanitize : '';
	pwdSanitize.includes(' ') ? '' : pwdSanitize;

	if (!pwdSanitize || !emailSanitize)
		return res
			.status(401)
			.json({ success: false, msg: 'Password and/or Email is not valid.' });

	// get user data
	const foundUser = await prisma.user.findUnique({
		where: { email: emailSanitize },
	});

	// found user with same email
	if (foundUser)
		return res.status(400).json({ success: false, msg: 'Email already exist' });

	// create password from client to hash data
	const hash = bcrypt.hashSync(password, 11);

	// create JWTs
	const accessToken = jwt.sign(
		{ email: emailSanitize },
		process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY,
		{ expiresIn: '1h' }
	);
	const refreshToken = jwt.sign(
		{ email: emailSanitize },
		process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY,
		{ expiresIn: '7d' }
	);

	const newUser = {
		email: emailSanitize,
		hash,
		refreshToken,
	};

	// create new user to DB
	const result = await prisma.user.create({ data: newUser });

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
	res.status(200).json({
		success: true,
		email: emailSanitize,
		token: accessToken,
	});
}
