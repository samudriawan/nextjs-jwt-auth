import Head from 'next/head';
import LoginForm from '../components/form/Login';

function Login() {
	return (
		<>
			<Head>
				<title>Login | Nextjs JWT App</title>

				<meta name="description" content="login next jwt authorization app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<header className="home-header">
				<h2>JWT Authorization</h2>
				<p>
					Use: <code>example@example.com</code> or{' '}
					<code>example2@example.com</code> and password: <code>password</code>
				</p>
			</header>
			<LoginForm />
		</>
	);
}
export default Login;
