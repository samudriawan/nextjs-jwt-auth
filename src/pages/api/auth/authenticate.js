// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import User from '../../../model/User';
import connectDB from '../../../helpers/dbConn';

export default async function handler(req, res) {
	const { email, password } = req.body;
	const { method } = req;

	// only accept POST method
	if (method !== 'POST')
		return res.status(500).json('Method is not supported.');

	// connect to mongoDB
	connectDB();

	// get user data
	const foundUser = await User.findOne({ email: email });

	// user not found
	if (!foundUser)
		return res.status(400).json({ success: false, msg: 'Email did not exist' });

	// compare password from client with hash data
	const passwordValid = await bcrypt.compare(password, foundUser.hash);

	if (!passwordValid)
		return res
			.status(400)
			.json({ success: false, msg: 'Password is not correct.' });

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

	// get refresh token from DB
	const refreshTokenArray = foundUser.refresh_token;

	// add newly created refresh token to DB
	refreshTokenArray.push(refreshToken);
	foundUser.refresh_token = refreshTokenArray;
	foundUser.save();

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
		email: foundUser.email,
		token: accessToken,
	});
}
