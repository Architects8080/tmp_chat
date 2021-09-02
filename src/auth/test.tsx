import React, { useEffect } from 'react';

function TestLogin() {

	const url = `http://localhost:5000/auth/test`;

	useEffect(() => {
		window.location.href = url;
	}, [])

	return (
		<>
		</>
	);
}

export default TestLogin;