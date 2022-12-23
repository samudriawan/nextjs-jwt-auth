import Head from 'next/head';
import Link from 'next/link';
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

				{!auth ? (
					<div className="home-links">
						<p>
							<Link href={'/login'}>
								<a className="link public-link">Login</a>
							</Link>{' '}
							or{' '}
							<Link href={'/register'}>
								<a className="link public-link">Register</a>
							</Link>{' '}
							to view the data.
						</p>
					</div>
				) : (
					<UserView />
				)}
			</div>
		</>
	);
}
export default UsersPage;
