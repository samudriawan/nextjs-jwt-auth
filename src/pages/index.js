import Head from 'next/head';
import FormWrapper from '../components/form/FormWrapper';

export default function Home() {
	return (
		<>
			<Head>
				<title>Nextjs JWT App</title>

				<meta name="description" content="next jwt authorization app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main>
				<header className="home-header">
					<h2>JWT Authorization</h2>
					<p>
						Use: <code>example@example.com</code> or{' '}
						<code>example2@example.com</code> and password:{' '}
						<code>password</code>
					</p>
				</header>
				<FormWrapper />
			</main>
		</>
	);
}
