import { io } from 'socket.io-client';
import type { ChatSocket } from '$lib/utils';
import { LoginEvent } from 'backFrontCommon';
import { goto } from '$app/navigation';

const LOGGIN_ROUTE: string = '/';
const LOGGIN_TOTP_ROUTE: string = '/totp';
export const LOGGIN_SUCCESS_ROUTE: string = '/Main';

const LOGGIN_ROUTES = [LOGGIN_ROUTE, LOGGIN_TOTP_ROUTE];

class State {
	private safeSocket: ChatSocket | null = null;
	private requireTotp: boolean = false;

	get socket(): ChatSocket {
		if (!this.safeSocket) throw new Error('Socket not initialized');
		return this.safeSocket;
	}

	get connected(): boolean {
		return !!this.safeSocket;
	}

	get loggedIn(): boolean {
		return this.connected && !this.requireTotp;
	}

	connect(code?: string) {
		if (this.connected) throw new Error('Allready connected');
		this.safeSocket = io('http://localhost:5000/login', { auth: { code } });
		this.setupHooks();
		if (!code) goto(LOGGIN_SUCCESS_ROUTE);
	}

	setupHooks() {
		this.socket.once('connect_error', this.onConnectError.bind(this));
		this.socket.once('disconnect', this.onDisconnect.bind(this));
		this.socket.once(LoginEvent.TOTP_REQUIREMENTS, this.onTotpRequirements.bind(this));
		this.socket.once(LoginEvent.TOTP_RESULT, this.onTotpResult.bind(this));
	}

	disconnect() {
		if (!this.connected) throw new Error('Not connected');
		this.socket.disconnect();
		this.safeSocket = null;
	}

	sendTotpToken(token: string) {
		this.socket.emit(LoginEvent.TOTP_CHECK, token);
	}

	// Hooks
	onConnectError() {
		// Clean close
		this.onDisconnect();
	}

	onDisconnect() {
		this.safeSocket = null;
		goto(LOGGIN_ROUTE);
	}

	onTotpRequirements(isRequired: boolean) {
		this.requireTotp = isRequired;
		goto(isRequired ? LOGGIN_TOTP_ROUTE : LOGGIN_SUCCESS_ROUTE);
	}

	onTotpResult(success: boolean) {
		this.requireTotp = false;
		goto(success ? LOGGIN_SUCCESS_ROUTE : LOGGIN_ROUTE);
	}

	// Used in +layout.svelte
	forceRoute(): string | null {
		if (!this.connected) return LOGGIN_ROUTE;
		if (this.requireTotp) return LOGGIN_TOTP_ROUTE;
		return null;
	}

	isBlocked(pathname: string): boolean {
		return this.loggedIn && LOGGIN_ROUTES.includes(pathname);
	}
}

export const state = new State();
