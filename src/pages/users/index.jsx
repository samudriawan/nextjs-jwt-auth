import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../context/authContext';

function UsersPage() {
	const [isLoading, setIsLoading] = useState(true);
	const [user, setUser] = useState(null);
	const router = useRouter();
	const { auth, setAuth } = useAuthContext();

	useEffect(() => {
		handleFetchRetry('http://localhost:3000/api/users');
	}, []);

	async function handleFetchRetry(url, token = auth ? auth.token : '') {
		try {
			// first get fetch
			const resp = await fetch(url, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			});

			// throw default status 500 error
			if (resp.status === 500) throw 'Internal Server Error';

			// if access token payload not match with database
			if (resp.status === 401) throw 'credentials not match';

			// if access token invalid, get new access token
			if (resp.status === 403) {
				const refresh = await fetch('http://localhost:3000/api/auth/refresh', {
					method: 'POST',
					credentials: 'include',
				});

				// throw default status 500 error
				if (refresh.status === 500) throw 'Internal Server Error';

				// refresh token expired
				if (refresh.status === 403) throw 'RefreshTokenExpired';

				// get new access token and store in localStorage and auth context
				const data = await refresh.json();
				const newToken = data.newAccessToken || '';
				localStorage.setItem(
					'user',
					JSON.stringify({ ...auth, token: newToken })
				);
				setAuth({ ...auth, token: newToken });

				// call the function again
				return await handleFetchRetry(url, newToken);
			}

			// status 200 OK
			const data = await resp.json();
			setUser(data);
			setIsLoading(false);
		} catch (err) {
			// signin out
			const resp = await fetch('http://localhost:3000/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
			if (resp.status === 204) {
				// delete localStorage and access token
				setAuth({ ...auth, token: '' });
				localStorage.removeItem('user');
				router.push('/login');
			}
		}
	}

	return (
		<>
			<Head>
				<title>User | Nextjs JWT App</title>

				<meta
					name="description"
					content="user page next jwt authorization app"
				/>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="user-container">
				<button onClick={() => router.back()} className="btn-back">
					Go Back
				</button>

				{isLoading ? (
					<p>No data to display</p>
				) : (
					<fieldset>
						<legend>
							<h1>Users Info</h1>
						</legend>
						<table>
							<tbody>
								<tr>
									<th>ID</th>
									<td>{user?._id}</td>
								</tr>
								<tr>
									<th>Email</th>
									<td>{user?.email}</td>
								</tr>
								<tr>
									<th>Date Created</th>
									<td>{new Date(user?.createdAt).toLocaleString()}</td>
								</tr>
							</tbody>
						</table>
					</fieldset>
				)}
			</div>
		</>
	);
}
export default UsersPage;
