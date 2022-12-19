import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuthContext } from '../../context/authContext';

function RegisterForm() {
	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [inputError, setInputError] = useState([]);
	const [canSubmit, setCanSubmit] = useState(false);
	const [serverResponse, setServerResponse] = useState(null);
	const { setAuth } = useAuthContext();
	const router = useRouter();
	const emailRef = useRef();

	useEffect(() => {
		emailRef.current.focus();
	}, []);

	function onChangeHandler(e) {
		const { name, value } = e.currentTarget;
		const nextValue = { ...formData, [name]: value };

		setFormData(nextValue);

		formValidation(nextValue);
	}

	function formValidation(states) {
		let errors = {};

		// validate email
		if (states.email && !validateEmail(states.email)) {
			errors = { ...errors, email: 'Email pattern is not correct.' };
			setInputError(errors);
		}

		// password length min 6
		if (states.password && states.password.length < 6) {
			errors = { ...errors, password: 'Password must have 6 letter of more' };
			setInputError(errors);
		}

		// password can not contains blank space
		if (states.password && states.password.includes(' ')) {
			errors = { ...errors, password: 'Password can not contain blank space.' };
			setInputError(errors);
		}

		// if there is an error, disabled the submit button
		if (errors['email'] || errors['password']) {
			setCanSubmit(false);
		} else {
			setCanSubmit(true);
		}

		setInputError(errors);

		// if one of input field empty, disabled submit button
		if (!states.email || !states.password) return setCanSubmit(false);
	}

	function validateEmail(str) {
		const regexEmail = /\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
		return str?.match(regexEmail) ? true : false;
	}

	async function onSubmitHandler(e) {
		e.preventDefault();

		const res = await fetch('http://localhost:3000/api/auth/register', {
			method: 'POST',
			body: JSON.stringify(formData),
			headers: {
				'Content-type': 'application/json',
			},
			credentials: 'include',
		});
		const data = await res.json();
		// {success: true, email: user.email,	token: accessToken }

		if (!data.success) {
			setServerResponse(data.msg);
			return;
		}

		localStorage.setItem('user', JSON.stringify(data));
		setServerResponse(null);
		setAuth(data);
		setFormData({
			email: '',
			password: '',
		});
		router.push('/');
	}

	return (
		<>
			<form action="POST" className="form" onSubmit={onSubmitHandler}>
				<h2>Register</h2>
				<div className="form-group">
					<label htmlFor="email">Email</label>
					<input
						type="text"
						name="email"
						id="email"
						ref={emailRef}
						value={formData.email}
						onChange={onChangeHandler}
						placeholder="Email"
					/>
					<span>{inputError && inputError['email']}</span>
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
					<span>{inputError && inputError.password}</span>
				</div>
				<button className="btn " disabled={!canSubmit}>
					Signup
				</button>
				<div style={{ textAlign: 'center', marginTop: '1rem' }}>
					{serverResponse != null ? serverResponse : ''}
				</div>
			</form>
		</>
	);
}
export default RegisterForm;
