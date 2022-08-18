import { io } from 'socket.io-client';
import { goto } from '$app/navigation';
import type { ChatSocket } from '$lib/utils';

const LOGGIN_SUCCESS_ROUTE : string = "/Main";

let socket : ChatSocket | null = null;

// Returns the socket or moves back to Login page
export async function getSocket(): Promise<ChatSocket> {
	if (!socket) await goto('/');
	return socket!;
}

// To call to check if being redirected 42 OAuth
export async function preLogin() : Promise<void> {
	const code = new URLSearchParams(document.location.search).get('code');
	if (!code) return;
	socket = io('http://localhost:5000/chat', { auth: { code } });
	socket.on()
	await goto(LOGGIN_SUCCESS_ROUTE);
}

// Login to 42 
export async function login(): Promise<void> {
	window.history.pushState({}, '');
	window.location.assign('http://localhost:5000/login');
}

export async function guestLogin(): Promise<void> {
	socket = io('http://localhost:5000/chat');
	await goto(LOGGIN_SUCCESS_ROUTE);
}
