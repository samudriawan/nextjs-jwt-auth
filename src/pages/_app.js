import Head from 'next/head';
import Navbar from '../components/Navbar';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<Navbar />
			<main>
				<Component {...pageProps} />
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
