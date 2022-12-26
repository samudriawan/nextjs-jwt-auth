import { apiHandler } from '../../../helpers/api/api-handler';
import prisma from '../../../lib/prisma';

export default apiHandler({
	get: getUser,
});

async function getUser(req, res) {
	// get email from token
	const email = req.email;

	// get user data without hash and refresh_token
	const foundUser = await prisma.user.findUnique({
		where: { email },
		select: {
			id: true,
			email: true,
			createdAt: true,
			updatedAt: true,
		},
	});

	// if email from token not match with in the database
	if (!foundUser) return res.status(401).send('credentials not match');

	return res.status(200).json(foundUser);
}
