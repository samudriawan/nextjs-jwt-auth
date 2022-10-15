import { useRouter } from 'next/router';
import { useState } from 'react';

function FormState() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [inputError, setInputError] = useState([]);
	const [canSubmit, setCanSubmit] = useState(false);
	const [serverResponse, setServerResponse] = useState(null);
	const router = useRouter();

	function onChangeHandler(e) {
		const { name, value } = e.currentTarget;
		const nextValue = { ...formData, [name]: value };

		setFormData(nextValue);

		formValidation(nextValue);
	}

	function formValidation(states) {
		let errors = [];

		// validate email
		if (states.email && !validateEmail(states.email)) {
			errors.push({ email: 'Email is not correct.' });
			setInputError(errors);
			setCanSubmit(false);
			return;
		}

		setInputError(errors);

		// if one of input field empty, disabled submit button
		if (!states.email || !states.password) return setCanSubmit(false);

		setCanSubmit(true);
	}

	function validateEmail(str) {
		const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		return str?.match(regexEmail) ? true : false;
	}

	async function onSubmitHandler(e) {
		e.preventDefault();

		const res = await fetch('http://localhost:3000/api/users/authenticate', {
			method: 'POST',
			body: JSON.stringify(formData),
			headers: { 'Content-type': 'application/json' },
			credentials: 'include',
		});
		const authed = await res.json();

		if (!authed.success) {
			setUser(null);
			setServerResponse(authed.msg);
			return;
		}

		localStorage.setItem('user', JSON.stringify(authed.user));
		setServerResponse(null);
		router.push('/');
	}

	return (
		<>
			<form action="POST" className="form" onSubmit={onSubmitHandler}>
				<h2>Login</h2>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="text"
						name="email"
						id="email"
						value={formData.email}
						onChange={onChangeHandler}
						placeholder="Email"
					/>
					<span>{inputError[0] && inputError[0].email}</span>
				</div>
				<div className="form-group">
					<label htmlFor="password">Password</label>
					<input
						type="password"
						name="password"
						id="password"
						value={formData.password}
						onChange={onChangeHandler}
						placeholder="Password"
					/>
				</div>
				<button className="btn " disabled={!canSubmit}>
					Login
				</button>
				<div style={{ textAlign: 'center', marginTop: '1rem' }}>
					{serverResponse != null ? serverResponse : ''}
				</div>
			</form>
		</>
	);
}
export default FormState;
