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
	}, [auth]);

	async function handleFetchRetry(url, token = auth ? auth.token : '') {
		try {
			// first get fetch
			const resp = await fetch(url, {
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			});
			// console.log('resp: ', resp.status);

			// if access token payload not match with database
			if (resp.status === 401) throw 'credentials not match';

			// if access token invalid, get new access token
			if (resp.status === 403) {
				const refresh = await fetch('http://localhost:3000/api/auth/refresh', {
					method: 'POST',
					credentials: 'include',
				});

				// refresh token expired
				if (refresh.status === 403) throw 'refresh token invalid';

				// get new access token and store in localStorage and auth context
				const json = await refresh.json();
				const newToken = json.newAccessToken;
				localStorage.setItem(
					'user',
					JSON.stringify({ ...auth, token: newToken })
				);
				// setUser({ token: newToken });
				setAuth({ ...auth, token: newToken });
				// console.log('refresh: ', user);

				// call the function again
				return await handleFetchRetry(url, newToken);
			}

			// status 200 OK
			// get the data
			const data = await resp.json();
			setUser(data);
			setIsLoading(false);

			// console.log('resp2: ', data);
		} catch (err) {
			// console.log('error catch: ', err);

			// signin out
			localStorage.removeItem('user');
			router.push('/login');
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
									<td>{user?.id}</td>
								</tr>
								<tr>
									<th>Email</th>
									<td>{user?.email}</td>
								</tr>
								<tr>
									<th>Date Created</th>
									<td>{user?.dateCreated}</td>
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
