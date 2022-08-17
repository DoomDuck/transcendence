import { io } from 'socket.io-client';
// import { PUBLIC_APP_42_ID } from '$env/static/public'; 
import { PUBLIC_APP_42_ID } from '$env/static/public';
import { goto } from '$app/navigation';
import type { ChatSocket } from '$lib/utils';

const LOCATION = 'https://api.intra.42.fr/oauth/authorize';

let socket : ChatSocket | null = null;

// Returns the socket or moves back to Login page
export async function getSocket(): Promise<ChatSocket> {
	if (!socket) await goto("/");
	return socket!;
}

// Login if request_login has been successful
// Throws an exception on failure
export async function login(): Promise<void> {
	const code = new URLSearchParams(document.location.search).get('code');
	if (code) {
		socket = io('http://localhost:5000/chat', { auth: { token: code } });
		await goto("/Main");
		return;
	}
	alert(`result: ${PUBLIC_APP_42_ID}`);
	// const redirect_url = encodeURIComponent(window.location.origin);
	// const url = `${LOCATION}?client_id=${env.PUBLIC_APP_42_ID}&redirect_uri=${redirect_url}&response_type=code`;
	// window.history.pushState({}, '');
	// window.location.assign(url);
}
