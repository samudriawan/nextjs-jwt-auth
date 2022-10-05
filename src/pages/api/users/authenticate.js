// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import bcrypt from 'bcryptjs';

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
	let passwordValid = false;

	// only accept POST method
	if (method !== 'POST')
		return res.status(500).json('Method is not supported.');

	const user = LOCAL_DATA.find((x) => x.email === email);

	if (!user)
		return res.status(400).json({ success: false, msg: 'User did not exist' });

	// compare password from client with hash data
	await bcrypt
		.compare(password, user.hash)
		.then((res) => (passwordValid = res))
		.catch((err) => res.status(500).json(err));

	if (!passwordValid)
		return res
			.status(400)
			.json({ success: false, msg: 'Password is not correct.' });

	return res.status(200).json({ success: true, user });
}
