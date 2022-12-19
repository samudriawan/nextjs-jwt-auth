import Head from 'next/head';
import { useRouter } from 'next/router';
import UserView from '../../components/UserView';
import { useAuthContext } from '../../context/authContext';

function UsersPage() {
	const router = useRouter();
	const { auth } = useAuthContext();

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

				{!auth ? <p>No data to display</p> : <UserView />}
			</div>
		</>
	);
}
export default UsersPage;
