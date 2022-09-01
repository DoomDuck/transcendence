import { io } from 'socket.io-client';
import { LoginEvent, ChatEvent, GetInfoEvent } from 'backFrontCommon';
import type { Id } from 'backFrontCommon';
import type { ClientSocket as Socket, CMFromServer, RequestFeedbackDto } from 'backFrontCommon';
import { goto } from '$app/navigation';
import type { GameParams } from '../ts/gameParams';
import * as gameInvite from '../ts/gameInvite';
import {
	DMFromServer,
	DMToServer,
	GameAcceptFromServer,
	GameCancelFromServer,
	GameInviteFromServer,
	GameRefuseFromServer,
	InviteChannelFromServer,
	GameInviteToServer,
	JoinChannelToServer,
	ChatFeedbackDto,
	CMToServer,
	CreateChannelToServer,
	GetUser,
	BlockUserToServer,
	FriendInviteToServer,
	BanUserFromServer
} from 'backFrontCommon/chatEvents';
import type { FeedbackCallback } from 'backFrontCommon/chatEvents';
import { MyInfo, UserInfo } from 'backFrontCommon/chatEvents';
import { channelConvs, userConvs } from '../ts/chatUtils';
import { readable, writable } from 'svelte/store';
import type { Readable, Writable, Subscriber } from 'svelte/store';
import { closeLastModalListener } from '$lib/ts/modals';

const LOGGIN_ROUTE: string = '/';
const LOGGIN_TOTP_ROUTE: string = '/totp';
export const LOGGIN_SUCCESS_ROUTE: string = '/Main';

const LOGGIN_ROUTES = [LOGGIN_ROUTE, LOGGIN_TOTP_ROUTE];

const USER_INFO_MOCKUP = new UserInfo(
    /* id */ 0, 
    /* name */ 'loading...', 
    /* win */ 0, 
    /* loose */ 0, 
    /* score */ 0, 
    /* ranking */ 0, 
    /* avatar */ null, 
    /* isOnline */ true, 
    /* inGame */ false, 
    /* matchHistory */ [], 
);

const MY_INFO_MOKUP = new MyInfo(
	/* id */ 0,
	/* name */ 'Loading..',
	/* friendlist */ [],
	/* blocked */ [],
	/* win */ 0,
	/* loose */ 0,
	/* score */ 0,
	/* ranking */ 0,
	/* avatar */ null,
	/* totpSecret */ null,
	/* inGame */ false
);

let setMyInfo: Subscriber<MyInfo> | undefined;
let resolveTotpRequired: ((token: string) => void) | null = null;

export let gameParams: GameParams | null = null;

export const myself: Readable<MyInfo> = readable(MY_INFO_MOKUP, (u) => {
	if (!setMyInfo) {
		updateMyself();
		setMyInfo = u;
	}
	return () => {};
});

export let socket: Socket | null = null;

export function connected(): boolean {
	return !!socket;
}

function loggedIn(): boolean {
	return connected() && !resolveTotpRequired;
}

export function connect(code?: string) {
	if (connected()) return;
	socket = io('http://localhost:5000/', { auth: { code } });
	setupHooks(socket);
}

export function disconnect() {
	if (!connected()) return;
	socket!.disconnect();
	socket = null;
	goto(LOGGIN_ROUTE);
}

function onLoginSuccess() {
	addStuff();
	goto(LOGGIN_SUCCESS_ROUTE);
}

// TODO: remove
function addStuff() {
	onMsgToUser(new DMFromServer(78441, 'salut'));
}

export function storeMap<A, B>(store: Readable<A>, f: (a: A) => B) : Readable<B> {
	 return readable<B>(undefined, setB => store.subscribe(a => setB(f(a))));
}

function onLoginFailure() {
	disconnect();
	goto(LOGGIN_ROUTE);
}

function setupHooks(socket: Socket) {
	socket.on('connect_error', onConnectError);
	socket.on('disconnect', onDisconnect);
	socket.on(LoginEvent.SUCCESS, onLoginSuccess);
	socket.on(LoginEvent.FAILURE, onLoginFailure);
	socket.on(LoginEvent.TOTP_REQUIRED, onTotpRequired);
	socket.on(ChatEvent.GOTO_GAME_SCREEN, onGotoGameScreen);
	socket.on(ChatEvent.MSG_TO_USER, onMsgToUser);
	socket.on(ChatEvent.MSG_TO_CHANNEL, onMsgToChannel);
	socket.on(ChatEvent.INVITE_TO_PRIVATE_CHANNEL, onInviteToPrivateChannel);
	socket.on(ChatEvent.GAME_INVITE, onGameInvite);
	socket.on(ChatEvent.GAME_ACCEPT, onGameAccept);
	socket.on(ChatEvent.GAME_REFUSE, onGameRefuse);
	socket.on(ChatEvent.GAME_CANCEL, onGameCancel);
	socket.on(ChatEvent.BANNED_NOTIF, onBannedNotif);

	window.addEventListener('keydown', closeLastModalListener);

	// DEBUG
	socket.onAny((event: string, ...args: any[]) => {
		console.log(`[RECEIVED] '${event}' << ${JSON.stringify(args)}`);
	});
	socket.prependAnyOutgoing((event: string, ...args: any[]) => {
		console.log(`[SENT] '${event}' >> ${JSON.stringify(args)}`);
	});
}

// Totp
export function sendTotpToken(token: string) {
	if (!resolveTotpRequired) throw new Error('No pending totp requirements');
	resolveTotpRequired(token);
	resolveTotpRequired = null;
}

export function disableTotp() {
	socket!.emit(LoginEvent.TOTP_UPDATE, null, updateMyself);
}

export function enableTotp(token: string) {
	socket!.emit(LoginEvent.TOTP_UPDATE, token, updateMyself);
}

// Update
export function updateMyself() {
	socket!.emit(GetInfoEvent.MY_INFO, onMyInfo);
}

// Users
export async function updateUser(id: Id) : Promise<UserInfo> {
	return new Promise(
		r => socket!.emit(
			GetInfoEvent.USER_INFO,
			new GetUser(id),
			info => r(onUserInfo(info))
		)
	);
}

// Game
export function refuseGame(target: Id) {
	socket!.emit(ChatEvent.GAME_REFUSE, { target });
}

export function acceptGame(target: Id, callback: FeedbackCallback) {
	socket!.emit(ChatEvent.GAME_ACCEPT, { target }, callback);
}

export function cancelGame(target: Id) {
	socket!.emit(ChatEvent.GAME_CANCEL, { target });
}

export function sendGameInvite(invite: GameInviteToServer, callback: FeedbackCallback) {
	socket!.emit(ChatEvent.GAME_INVITE, invite, callback);
}

export function clearGameParams() {
	gameParams = null;
}

export function joinGame(classic: boolean) {
	socket!.emit(ChatEvent.JOIN_MATCHMAKING, classic);
}

export function playGame(online: boolean, observe?: boolean, matchMaking?: boolean) {
	gameParams = {
		online,
		observe,
		matchMaking
	};
	goto('/ChooseGameMode');
}

export function observeGame(id: Id) {
	socket!.emit(ChatEvent.GAME_OBSERVE, id, (feedback) => {
		if (feedback.success) {
			gameParams = {
				online: true,
				observe: true
			};
			goto('/Play');
		} else {
			console.error(feedback.errorMessage);
		}
	});
}

// Users

const knownUsers = new Map<Id, { data?: UserInfo, store: Writable<UserInfo>}>();
export function getUser(id: Id) : Readable<UserInfo> {
	const entry = knownUsers.get(id);
	if (entry) return entry.store;
	const store = writable<UserInfo>(USER_INFO_MOCKUP);
	knownUsers.set(id, {store});
	updateUser(id);
	return store;
}

export async function getUserNow(id: Id) : Promise<UserInfo> {
	const entry = knownUsers.get(id);
	if (entry?.data) return entry.data;
	return updateUser(id);
}

export function clearUserCache() {
	knownUsers.clear()
}

// Avatar
export async function uploadAvatar(imageDataUrl: string) {
	socket!.emit(ChatEvent.POST_AVATAR, { imageDataUrl }, (feedback) => {
		// TODO: change
		alert(JSON.stringify(feedback));
	});
}

// Chat
export function sendDirectMessage(message: DMToServer) {
	socket!.emit(ChatEvent.MSG_TO_USER, message, (feedback: ChatFeedbackDto) => {
		if (!feedback.success) {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendCreateChannel(message: CreateChannelToServer) {
	socket!.emit(ChatEvent.CREATE_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.create(message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendChannelMessage(message: CMToServer) {
	socket!.emit(ChatEvent.MSG_TO_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.addMessageFromMe(message.content, message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendJoinChannel(message: JoinChannelToServer) {
	socket!.emit(ChatEvent.JOIN_CHANNEL, message, (feedback: ChatFeedbackDto) => {
		if (feedback.success) {
			channelConvs.update((_) => _.create(message.channel));
		} else {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendBlockUser(message: BlockUserToServer) {
	socket!.emit(ChatEvent.BLOCK_USER, message, (feedback: ChatFeedbackDto) => {
		if (!feedback.success) {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

export function sendFriendInvite(message: FriendInviteToServer) {
	socket!.emit(ChatEvent.FRIEND_INVITE, message, (feedback: ChatFeedbackDto) => {
		if (!feedback.success) {
			alert(`error: ${feedback.errorMessage}`);
		}
	});
}

// Hooks
function onConnectError() {
	// Clean close
	onDisconnect();
}

function onDisconnect() {
	socket = null;
	goto(LOGGIN_ROUTE);
}

function onTotpRequired(callback: (token: string) => void) {
	resolveTotpRequired = callback;
	goto(LOGGIN_TOTP_ROUTE);
}

function onMyInfo(feedback: RequestFeedbackDto<MyInfo>) {
	if (feedback.success) {
		// TODO: remove
		const myInfo = feedback.result!;
		myInfo.friendlist.push(78441);
		if (setMyInfo) setMyInfo(myInfo);
	}
	else console.error("Could not get my info");
}

async function onUserInfo(feedback: RequestFeedbackDto<UserInfo>) : Promise<UserInfo> {
	if (!feedback.success)
		throw new Error("Could not get user info");
	const user = feedback.result!; 
	let entry = knownUsers.get(user.id);
	if (entry) {
		entry.store.update(_ => user);
	} else {
		knownUsers.set(user.id, {
			data: user,
			store: writable(user) 
		});
	}
	return user;
}

function onGotoGameScreen(classic: boolean, ready: () => void) {
	gameParams = { classic, online: true };
	if (window.location.href != '/Play') goto('/Play').then(ready);
}

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

function onBannedNotif(message: BanUserFromServer) {
	channelConvs.update((_) => {
		_.getBanned(message.channel);
		return _;
	});
}

// Used in +layout.svelte
export function forceRoute(): string | null {
	if (!connected()) return LOGGIN_ROUTE;
	if (resolveTotpRequired) return LOGGIN_TOTP_ROUTE;
	return null;
}

export function isBlocked(pathname: string): boolean {
	return loggedIn() && LOGGIN_ROUTES.includes(pathname);
}
