import { connect } from '$lib/state';

// Check if being redirected 42 OAuth
export function preLogin() {
	document.title = "Transcendance";

	// Check for code parmeter in URL
	const code = new URLSearchParams(document.location.search).get('code');
	if (!code) return;

	connect(code);
}

// Login to 42
export function login() {
	window.location.assign('http://localhost:5000/login');
}

export function guestLogin() {
	connect();
}
