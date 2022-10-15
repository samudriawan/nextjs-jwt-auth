import Head from 'next/head';
import Link from 'next/link';

export default function Home(props) {
	const { user } = props;

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
		</>
	);
}
