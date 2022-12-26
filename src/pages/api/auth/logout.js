import { apiHandler } from '../../../helpers/api/api-handler';
import prisma from '../../../lib/prisma';
import cookie from 'cookie';

export default apiHandler({
	post: logout,
});

async function logout(req, res) {
	const { method, cookies } = req;

	if (method !== 'POST') return res.status(500).json('method error');

	if (!cookies.jwt) return res.status(204).end(); // No content

	const refreshTokenCookies = cookies.jwt;

	// is refresh token in DB?
	const foundUser = await prisma.user.findFirst({
		where: { refreshToken: refreshTokenCookies },
	});

	// delete refresh token in DB
	if (foundUser) {
		const result = await prisma.user.update({
			where: { email: foundUser.email },
			data: { refreshToken: '' },
		});
		// console.log(result);
	}

	// delete cookies
	res.setHeader(
		'Set-Cookie',
		cookie.serialize('jwt', '', {
			httpOnly: true, // accessible only by web server
			secure: true, // https
			sameSite: 'none', // cross-site cookie
			maxAge: 0, // cookie expire, set to match refresh token
			path: '/',
		})
	);

	res.status(204).end();
}
