import { useRouter } from 'next/router';

function UsersPage({ user }) {
	const router = useRouter();

	return (
		<div className="user-container">
			<button onClick={() => router.back()} className="btn-back">
				Go Back
			</button>
			<fieldset>
				<legend>
					<h1>User Info</h1>
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
	);
}
export default UsersPage;
