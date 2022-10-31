import Head from 'next/head';
import { useRouter } from 'next/router';

export default function Home(props) {
	const { user } = props;
	const router = useRouter();

	return (
		<>
			<Head>
				<title>Nextjs JWT App</title>

				<meta name="description" content="next jwt authorization app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className="home-header">
				<h1>Hi, {user?.email}!</h1>
				<p>You&apos;re logged in with Next.js & JWT!!</p>
			</header>

			<div className="home-content">
				<button
					onClick={() => {
						localStorage.removeItem('user');
						router.push('/');
					}}
					className="btn-logout"
				>
					Sign out
				</button>
			</div>
		</>
	);
}
