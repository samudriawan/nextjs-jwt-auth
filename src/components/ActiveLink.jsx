import Link from 'next/link';
import { useRouter } from 'next/router';

function ActiveLink({ children, href, class_name }) {
	const router = useRouter();

	const active = router.asPath === href ? ' active-link ' : '';

	return (
		<Link href={href}>
			<a className={class_name + active}>{children}</a>
		</Link>
	);
}
export default ActiveLink;
