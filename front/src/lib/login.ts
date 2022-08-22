import { io } from 'socket.io-client';
import { goto } from '$app/navigation';
import type { ChatSocket } from '$lib/utils';
import { LoginEvent } from 'backFrontCommon';

export const LOGGIN_SUCCESS_ROUTE : string = "/Main";

let socket : ChatSocket | null = null;

// Returns the socket or moves back to Login page
export async function getSocket(): Promise<ChatSocket> {
	if (!socket) await goto('/');
	return socket!;
}

// Check if being redirected 42 OAuth
export async function preLogin() : Promise<void> {
	// Check for code parmeter in URL
	const code = new URLSearchParams(document.location.search).get('code');
	if (!code) return;
	
	// Connect to backend
	socket = io('http://localhost:5000/chat', { auth: { code } });
	
	// Check if 2 factor auth is required
	console.log("Waiting...");
	const totp_is_required = await new Promise<boolean>(r => socket!.once(LoginEvent.TOTP_IS_REQUIRED, r));
	console.log(totp_is_required);

	if (totp_is_required)
		await goto("/totp");
	
	// Force setup for now
	await goto('/totp/setup');
	return;
	
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
