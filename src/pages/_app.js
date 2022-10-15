import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	const [user, setUser] = useState(null);
	const [authorized, setAuthorized] = useState(false);

	const router = useRouter();

	useEffect(() => {
		authCheck(router.asPath);

		const hideContent = () => setAuthorized(false);
		router.events.on('routeChangeStart', hideContent);

		router.events.on('routeChangeComplete', authCheck);

		return () => {
			router.events.off('routeChangeStart', hideContent);
			router.events.off('routeChangeComplete', authCheck);
		};
	}, []);

	function authCheck(url) {
		const userValue = JSON.parse(localStorage.getItem('user'));
		setUser(userValue);
		const publicPaths = ['/login'];

		if (!userValue && !publicPaths.includes(url)) {
			setAuthorized(false);
			router.push('/login');
		} else {
			setAuthorized(true);
		}
	}

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<Navbar />
			<main>
				{authorized ? (
					<Component {...pageProps} user={user} />
				) : (
					<p>Please wait...</p>
				)}
			</main>
			<footer>
				2022{' '}
				<a
					href="http://github.com/samudriawan"
					target="_blank"
					rel="noopener noreferrer"
				>
					samudriawan
				</a>
			</footer>
		</>
	);
}

export default MyApp;
