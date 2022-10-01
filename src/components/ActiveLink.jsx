import Link from 'next/link';
import { useRouter } from 'next/router';

function ActiveLink({ children, href, class_name }) {
	const router = useRouter();

	const style = {
		backgroundColor: router.asPath === href ? '#3e4756' : '',
	};

	return (
		<Link href={href}>
			<a className={class_name} style={style}>
				{children}
			</a>
		</Link>
	);
}
export default ActiveLink;
