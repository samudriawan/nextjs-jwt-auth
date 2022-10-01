import Head from 'next/head';
import Navbar from '../components/Navbar';
import '../styles/globals.scss';

function MyApp({ Component, pageProps }) {
	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			</Head>
			<div className="app-container">
				<Navbar />
				<Component {...pageProps} />
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
			</div>
		</>
	);
}

export default MyApp;
