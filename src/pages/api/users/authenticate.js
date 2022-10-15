// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

const LOCAL_DATA = [
	{
		email: 'example@example.com',
		hash: '$2a$10$Z8qEQjShwKxM72UPrgReIOdLIZslhIDxcU0KQkjmCzSsrcxZ9PSd2', // password
		dateCreated: '10/2/2022, 5:06:23 PM',
		dateModified: '10/2/2022, 5:06:24 PM',
		id: 1,
	},
	{
		email: 'example2@example.com',
		hash: '$2a$10$Z8qEQjShwKxM72UPrgReIOdLIZslhIDxcU0KQkjmCzSsrcxZ9PSd2', // password
		dateCreated: '10/2/2022, 5:06:23 PM',
		dateModified: '10/2/2022, 5:06:24 PM',
		id: 2,
	},
];

export default async function handler(req, res) {
	const { email, password } = req.body;
	const { method } = req;

	// only accept POST method
	if (method !== 'POST')
		return res.status(500).json('Method is not supported.');

	const user = LOCAL_DATA.find((x) => x.email === email);

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
		// TODO: change expiresIn when before deploy the app
		{ expiresIn: 60 }
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
			sameSite: 'None', // cross-site cookie
			maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expire, set to match refresh token
		})
	);

	return res.json({ success: true, user: { email: user.email, accessToken } });
}
