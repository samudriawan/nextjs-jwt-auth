import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { authContext } from '../context/authContext';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	const [authorized, setAuthorized] = useState(false);
	const [auth, setAuth] = useState(null);

	const router = useRouter();

	useEffect(() => {
		authCheck(router.asPath);
		setAuth(JSON.parse(localStorage.getItem('user')));

		router.events.on('routeChangeComplete', authCheck);

		return () => {
			router.events.off('routeChangeComplete', authCheck);
		};
	}, []);

	console.log(auth);
	function authCheck(url) {
		const userValue = JSON.parse(localStorage.getItem('user'));
		const publicPaths = ['/login'];

		if (!userValue && !publicPaths.includes(url)) {
			router.push('/login');
			setAuthorized(false);
		} else if (userValue && publicPaths.includes(url)) {
			router.push('/');
			setAuthorized(false);
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
				{authorized && (
					<authContext.Provider value={{ auth, setAuth }}>
						<Component {...pageProps} />
					</authContext.Provider>
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
