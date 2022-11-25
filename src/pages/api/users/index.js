import { apiHandler } from '../../../helpers/api/api-handler';
import users from '../../../data/db.json';

export default apiHandler({
	get: getUser,
});

function getUser(req, res) {
	// get email from token
	const email = req.email;

	const user = users.find((u) => u.email === email);

	// if email from token not match with in the database
	if (!user) return res.status(401).send('credentials not match');

	return res.status(200).json(user);
}
