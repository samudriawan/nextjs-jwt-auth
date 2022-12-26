import jwt from 'jsonwebtoken';

export function apiHandler(handler) {
	return async (req, res) => {
		const method = req.method.toLowerCase();

		// check handler supports HTTP method
		if (!handler[method]) return res.status(405).end();

		const publicPaths = [
			'/api/auth/authenticate',
			'/api/auth/refresh',
			'/api/auth/logout',
			'/api/auth/register',
		];

		try {
			// if endpoint not includes in publicPaths
			// skip Authorization Bearer checking
			if (!publicPaths.includes(req.url)) {
				const authHeaders = req.headers['authorization'] || null;

				if (!authHeaders && !authHeaders.startsWith('Bearer '))
					return res.status(401);

				const accessToken = authHeaders.split(' ')[1];

				// verify access token
				const decoded = jwt.verify(
					accessToken,
					process.env.NEXT_PUBLIC_ACCESS_TOKEN_KEY
				);
				req.email = decoded.email;
			}

			// route handler
			await handler[method](req, res);
		} catch (err) {
			if (err.message === 'jwt expired') {
				return res.status(403).send(err.message);
			}

			// default to 500 server error
			return res.status(500).json(err);
		}
	};
}
