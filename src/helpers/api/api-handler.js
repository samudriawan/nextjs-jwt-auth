import jwt from 'jsonwebtoken';

export function apiHandler(handler) {
	return async (req, res) => {
		const method = req.method.toLowerCase();
		// console.log(req.headers['authorization']);

		// check handler supports HTTP method
		if (!handler[method]) return res.status(405);

		try {
			const authHeaders = req.headers['authorization'] || null;
			const bearerAuth = authHeaders.startsWith('Bearer ');
			if (!bearerAuth) return res.status(401);

			const accessToken = bearerAuth.split(' ')[1];

			// verify access token
			const decoded = jwt.verify(
				accessToken,
				process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY
			);
			req.email = decoded.email;

			// route handler
			await handler[method](req, res);
		} catch (err) {
			if (err.message === 'jwt expired')
				return res.status(403).send(err.message);

			// default to 500 server error
			return res.status(500).json(err);
		}
	};
}
