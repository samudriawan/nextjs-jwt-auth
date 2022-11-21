import Head from 'next/head';
import { useRouter } from 'next/router';

function UsersPage({ user }) {
	const router = useRouter();
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

				<fieldset>
					<legend>
						<h1>Users Info</h1>
					</legend>
					<table>
						<tbody>
							<tr>
								<th>ID</th>
								<td>{user.id}</td>
							</tr>
							<tr>
								<th>Email</th>
								<td>{user.email}</td>
							</tr>
							<tr>
								<th>Date Created</th>
								<td>{user.dateCreated}</td>
							</tr>
						</tbody>
					</table>
				</fieldset>
			</div>
		</>
	);
}
export default UsersPage;
