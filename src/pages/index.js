import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthContext } from '../context/authContext';

export default function Home() {
	const router = useRouter();
	const { auth, setAuth } = useAuthContext();

	async function handleLogout() {
		const resp = await fetch('http://localhost:3000/api/auth/logout', {
			method: 'POST',
			credentials: 'include',
		});
		if (resp.status === 204) {
			// delete localStorage and access token
			setAuth(null);
			localStorage.removeItem('user');
			router.push('/');
		}
	}

	return (
		<>
			<Head>
				<title>Nextjs JWT App</title>

				<meta name="description" content="next jwt authorization app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			{auth ? (
				<>
					{/* logged in view */}
					<header className="home-header">
						<h1>Hi, {auth?.email}!</h1>
						<p>You&apos;re logged in with Next.js & JWT!!</p>
					</header>

					<div className="home-content">
						<Link href={'/users'}>
							<a className="link private-link">Manage Users</a>
						</Link>
						<button onClick={handleLogout} className="btn-logout">
							Sign out
						</button>
					</div>
				</>
			) : (
				<>
					{/* not logged in view */}
					<header className="home-header">
						<h2>JWT Authorization</h2>
						<p> with Next.js & JWT!!</p>
					</header>

					<div className="home-content">
						<Link href={'/users'}>
							<a className="link private-link">Manage Users</a>
						</Link>
						<div className="home-links">
							<Link href={'/login'}>
								<a className="link public-link">Login</a>
							</Link>
							|
							<Link href={'/register'}>
								<a className="link public-link">Register</a>
							</Link>
						</div>
					</div>
				</>
			)}
		</>
	);
}
