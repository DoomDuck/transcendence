import { io } from 'socket.io-client';
import { LoginEvent, ChatEvent, GetInfoEvent, type UserHistoryDto } from 'backFrontCommon';
import type {
	ClientSocket as Socket,
	CMFromServer,
	UserInfo,
	RequestFeedbackDto
} from 'backFrontCommon';
import { goto } from '$app/navigation';
import type { GameParams } from './gameParams';
import * as gameInvite from './gameInvite';
import { DMFromServer } from 'backFrontCommon';
import type {
	GameAcceptFromServer,
	GameCancelFromServer,
	GameInviteFromServer,
	GameRefuseFromServer,
	MyInfo
} from 'backFrontCommon/chatEvents';
import type { InviteChannelFromServer } from 'backFrontCommon/chatEvents';
import { channelConvs, updateChatHistory, userConvs } from './chatUtils';

const LOGGIN_ROUTE: string = '/';
const LOGGIN_TOTP_ROUTE: string = '/totp';
export const LOGGIN_SUCCESS_ROUTE: string = '/Main';

const LOGGIN_ROUTES = [LOGGIN_ROUTE, LOGGIN_TOTP_ROUTE];

class State {
	private safeSocket: Socket | null = null;
	private safeMyInfo: MyInfo | null = null;
	private resolveTotpRequired: ((token: string) => void) | null = null;
	public gameParams?: GameParams;

	get socket(): Socket {
		if (this.safeSocket) return this.safeSocket;
		throw new Error('Socket not initialized');
	}

	get connected(): boolean {
		return !!this.safeSocket;
	}

	get loggedIn(): boolean {
		return this.connected && !this.resolveTotpRequired;
	}

	get myInfo(): MyInfo {
		if (this.safeMyInfo) return this.safeMyInfo;
		throw new Error('MyInfo is not initialized');
	}

	connect(code?: string) {
		// TODO: Maybe just return instead of throwing an error
		if (this.connected) throw new Error('Allready connected');
		this.safeSocket = io('http://localhost:5000/', { auth: { code } });
		this.setupHooks();
	}

	onLoginSuccess() {
		// onMsgToUser(new DMFromServer(77106, 'salut'));
		this.socket.emit(GetInfoEvent.MY_INFO, this.onMyInfoResult.bind(this));
		this.socket.emit(ChatEvent.GET_CHAT_HISTORY, this.onGetChatHistory.bind(this));
		goto(LOGGIN_SUCCESS_ROUTE);
	}

	onLoginFailure() {
		this.disconnect();
		goto(LOGGIN_ROUTE);
	}

	setupHooks() {
		this.socket.on('connect_error', this.onConnectError.bind(this));
		this.socket.on('disconnect', this.onDisconnect.bind(this));

		this.socket.on(LoginEvent.SUCCESS, this.onLoginSuccess.bind(this));
		this.socket.on(LoginEvent.FAILURE, this.onLoginFailure.bind(this));
		this.socket.on(LoginEvent.TOTP_REQUIRED, this.onTotpRequired.bind(this));

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
		goto(LOGGIN_ROUTE);
	}

	sendTotpToken(token: string) {
		if (!this.resolveTotpRequired) throw new Error('No pending totp requirements');
		this.resolveTotpRequired(token);
		this.resolveTotpRequired = null;
	}

	updateMyInfo() {
		// TODO
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

	onTotpRequired(callback: (token: string) => void) {
		this.resolveTotpRequired = callback;
		goto(LOGGIN_TOTP_ROUTE);
	}

	onMyInfoResult(feedback: RequestFeedbackDto<MyInfo>) {
		if (feedback.success && feedback.result) this.safeMyInfo = feedback.result;
		else console.error('Could not get user info');
	}

	onGotoGameScreen(classic: boolean, ready: () => void) {
		this.gameParams = { classic, online: true };
		if (window.location.href != '/Play') goto('/Play').then(ready);
	}

	onGetChatHistory(feedback: RequestFeedbackDto<UserHistoryDto>) {
		if (feedback.success) updateChatHistory(feedback.result!);
		else console.error(feedback.errorMessage);
	}

	// Used in +layout.svelte
	forceRoute(): string | null {
		if (!this.connected) return LOGGIN_ROUTE;
		if (this.resolveTotpRequired) return LOGGIN_TOTP_ROUTE;
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
