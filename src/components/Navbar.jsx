import ActiveLink from './ActiveLink';

function Navbar() {
	return (
		<nav className="navbar">
			<ActiveLink href={'/'} class_name={'nav-link'}>
				Home
			</ActiveLink>
			{/* <ul className="nav">
				<li className="nav-item">
					<ActiveLink href={'/user'} class_name={'nav-link'}>
						About
					</ActiveLink>
				</li>
				<li className="nav-item">
					<ActiveLink href={'/login'} class_name={'nav-link'}>
						Login
					</ActiveLink>
				</li>
				<li className="nav-item">
					<ActiveLink href={'/register'} class_name={'nav-link'}>
						Register
					</ActiveLink>
				</li>
			</ul> */}
		</nav>
	);
}
export default Navbar;
