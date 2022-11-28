import { apiHandler } from '../../../helpers/api/api-handler';
import User from '../../../model/User';
import cookie from 'cookie';

export default apiHandler({
	post: logout,
});

async function logout(req, res) {
	const { method, cookies } = req;

	if (method !== 'POST') return res.status(500);

	if (!cookies) return res.status(204); // No content

	const refreshToken = cookies.jwt;

	// is refresh token in DB?
	const foundUser = await User.findOne({ refresh_token: refreshToken }).exec();
	// delete refresh token in DB
	if (foundUser) {
		foundUser.refresh_token = foundUser.refresh_token.filter(
			(rt) => rt !== refreshToken
		);
		await foundUser.save();
		console.log('breakpoint');
		// delete cookies
		// res.setHeader(
		// 	'Set-Cookie',
		// 	cookie.serialize('jwt', 'deleted', {
		// 		httpOnly: true, // accessible only by web server
		// 		secure: true, // https
		// 		sameSite: 'none', // cross-site cookie
		// 		maxAge: 0, // cookie expire, set to match refresh token
		// 		path: '/',
		// 		expires: Date.now(),
		// 	})
		// );
	}

	// delete cookies
	res.setHeader(
		'Set-Cookie',
		cookie.serialize('jwt', 'deleted', {
			httpOnly: true, // accessible only by web server
			secure: true, // https
			sameSite: 'none', // cross-site cookie
			maxAge: 0, // cookie expire, set to match refresh token
			path: '/',
		})
	);

	res.status(204).end();
}
