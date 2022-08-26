import { io } from 'socket.io-client';
import { LoginEvent, ChatEvent } from 'backFrontCommon';
import type { ClientSocket as Socket, CMFromServer } from 'backFrontCommon';
import { goto } from '$app/navigation';
import type { GameParams } from './gameParams';
import * as gameInvite from './gameInvite';
import type {
	DMFromServer,
	GameAcceptFromServer,
	GameCancelFromServer,
	GameInviteFromServer,
	GameRefuseFromServer
} from 'backFrontCommon/chatEvents';
import type { InviteChannelFromServer } from 'backFrontCommon/chatEvents';
import { channelConvs, userConvs } from './chatUtils';

const LOGGIN_ROUTE: string = '/';
const LOGGIN_TOTP_ROUTE: string = '/totp';
export const LOGGIN_SUCCESS_ROUTE: string = '/Main';

const LOGGIN_ROUTES = [LOGGIN_ROUTE, LOGGIN_TOTP_ROUTE];

class State {
	private safeSocket: Socket | null = null;
	private requireTotp: boolean = false;
	public gameParams?: GameParams;

	get socket(): Socket {
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
		console.log();
		if (this.connected) throw new Error('Allready connected');
		this.safeSocket = io('http://localhost:5000/', { auth: { code } });
		this.setupHooks();
		if (!code) goto(LOGGIN_SUCCESS_ROUTE);
	}

	setupHooks() {
		this.socket.once('connect_error', this.onConnectError.bind(this));
		this.socket.once('disconnect', this.onDisconnect.bind(this));
		this.socket.once(LoginEvent.TOTP_REQUIREMENTS, this.onTotpRequirements.bind(this));
		this.socket.once(LoginEvent.TOTP_RESULT, this.onTotpResult.bind(this));
		this.socket.on(ChatEvent.GOTO_GAME_SCREEN, this.onGotoGameScreen.bind(this));
		this.socket.on(ChatEvent.MSG_TO_USER, onMsgToUser);
		this.socket.on(ChatEvent.MSG_TO_CHANNEL, onMsgToChannel);
		this.socket.on(ChatEvent.INVITE_TO_PRIVATE_CHANNEL, onInviteToPrivateChannel);
		this.socket.on(ChatEvent.GAME_INVITE, onGameInvite);
		this.socket.on(ChatEvent.GAME_ACCEPT, onGameAccept);
		this.socket.on(ChatEvent.GAME_REFUSE, onGameRefuse);
		this.socket.on(ChatEvent.GAME_CANCEL, onGameCancel);

		// DEBUG
		this.socket.onAny((event: string, ...args: any[]) => {
			console.log(`[RECEIVED] '${event}' << ${JSON.stringify(args)}`);
		});
		this.socket.prependAnyOutgoing((event: string, ...args: any[]) => {
			console.log(`[SENT] '${event}' >> ${JSON.stringify(args)}`);
		});
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

	onGotoGameScreen(classic: boolean, ready: () => void) {
		this.gameParams = { classic, online: true };
		if (window.location.href != '/Play') goto('/Play').then(ready);
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

function onMsgToUser(message: DMFromServer) {
	userConvs.update((_) => _.receiveMessageFromServer(message));
}

function onMsgToChannel(message: CMFromServer) {
	channelConvs.update((_) => _.receiveMessageFromServer(message));
}

function onInviteToPrivateChannel(message: InviteChannelFromServer) {
	channelConvs.update((_) => _.create(message.channel));
}

function onGameInvite(message: GameInviteFromServer) {
	gameInvite.receive(message);
}

function onGameAccept(message: GameAcceptFromServer) {
	gameInvite.removeSent(message.source);
}

function onGameRefuse(message: GameRefuseFromServer) {
	gameInvite.removeSent(message.source);
}

function onGameCancel(message: GameCancelFromServer) {
	gameInvite.revokeReceived(message.source);
}

