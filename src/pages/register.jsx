import Head from 'next/head';
import Link from 'next/link';
import RegisterForm from '../components/form/Register';

function Register() {
	return (
		<>
			<Head>
				<title>Register | Nextjs JWT App</title>

				<meta name="description" content="signup next jwt authorization app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<header className="home-header">
				<h2>JWT Authorization</h2>
				<p style={{ fontSize: '1.3rem' }}>
					This will create new account with an Email and Password
				</p>
			</header>
			<RegisterForm />
			<p style={{ textAlign: 'center' }}>
				Go to{' '}
				<Link href={'/login'}>
					<a className="public-link">Login</a>
				</Link>{' '}
				page
			</p>
		</>
	);
}
export default Register;
