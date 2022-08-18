import { io } from 'socket.io-client';
import { goto } from '$app/navigation';
import type { ChatSocket } from '$lib/utils';

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
	window.history.pushState({}, '');
	window.location.assign('http://localhost:5000/login');
}
