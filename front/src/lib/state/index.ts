import { io } from 'socket.io-client';
import { LoginEvent, ChatEvent, GetInfoEvent } from 'backFrontCommon';
import type { Id } from 'backFrontCommon';
import type { ClientSocket as Socket, CMFromServer, RequestFeedbackDto } from 'backFrontCommon';
import { goto } from '$app/navigation';
import type { GameParams } from '../ts/gameParams';
import * as gameInvite from '../ts/gameInvite';
import {
	DMFromServer,
	GameAcceptFromServer,
	GameCancelFromServer,
	GameInviteFromServer,
	GameRefuseFromServer,
	InviteChannelFromServer,
	GameInviteToServer,
} from 'backFrontCommon/chatEvents';
import type { FeedbackCallback } from 'backFrontCommon/chatEvents';
import { MyInfo, UserInfo } from 'backFrontCommon/chatEvents';
import { channelConvs, userConvs } from '../ts/chatUtils';
import { type Readable, readable, type Subscriber } from 'svelte/store';


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
    /* inGame */ false, 
);

let setMyInfo!: Subscriber<MyInfo>;
let resolveTotpRequired: ((token: string) => void) | null = null;
let knownUsers = new Map<Id, UserInfo>();


export let gameParams: GameParams | null = null;
	
export const myInfo: Readable<MyInfo> = readable(MY_INFO_MOKUP, u => {
	updateMyInfo();
	setMyInfo = u;
	return () => { };
});
	
let socket: Socket | null = null;

function connected(): boolean {
	return !!socket;
}

function loggedIn(): boolean {
	return connected() && !!resolveTotpRequired;
}

export function connect(code?: string) {
	console.log("Hello");
	if (connected()) return;
	// TODO: Decide on method
	// throw new Error('Allready connected');
	socket = io('http://localhost:5000/', { auth: { code } });
	setupHooks(socket);
}

export function disconnect() {
	if (!connected())
		return;
	// TODO: keep or remove
	// throw new Error('Not connected');
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
	// onMsgToChannel(new 
	// addMessage(
	// 	{
	// 		sender: -1,
	// 		isMe: true,
	// 		content: 'Salut,\nJe crée un groupe'
	// 	},
	// 	'Un groupe de gens'
	// );
	// channelConvs.addMessage(
	// 	{
	// 		sender: 1,
	// 		isMe: false,
	// 		content: 'Pas intéressé'
	// 	},
	// 	'Un groupe de gens'
	// );
	// channelConvs.addMessage(
	// 	{
	// 		sender: 2,
	// 		isMe: false,
	// 		content: 'Moi non plus'
	// 	},
	// 	'Un groupe de gens'
	// );
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
	socket!.emit(LoginEvent.TOTP_UPDATE, null);
	// TODO update profile
}

export function enableTotp(token: string) {
	socket!.emit(LoginEvent.TOTP_UPDATE, token);
	// TODO update profile
}

// MyInfo
export function updateMyInfo() {
	socket!.emit(GetInfoEvent.MY_INFO, onMyInfoResult);
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
	socket!.emit(ChatEvent.GAME_INVITE, invite, callback)
}

export function clearGameParams() {
	gameParams = null;
}

export function playGame(online: boolean, observe?: boolean, matchMaking?: boolean) {
	gameParams = {
		online,
		observe,
		matchMaking
	};
	goto('/ChooseGameMode');
}

// Users
export async function getUser(id: Id): Promise<UserInfo>  {
	const user = knownUsers.get(id);
	if (user) return user;
	return new Promise(r => socket!.emit(GetInfoEvent.USER_INFO, {target: id}, feedback => {
		if (!feedback.success) throw new Error(`Could not fetch user info ${feedback.errorMessage}`);
		const user = feedback.result!;
		knownUsers.set(id, user);
		r(user);
	}));
}

// 
export async function uploadAvatar(imageDataUrl: string) {
	socket!.emit(ChatEvent.POST_AVATAR, { imageDataUrl }, (feedback) => {
		// TODO: change
		alert(JSON.stringify(feedback));
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

function onMyInfoResult(feedback: RequestFeedbackDto<MyInfo>) {
	if (feedback.success)
		setMyInfo(feedback.result!);
	else console.error("Could not get user info");
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

// Used in +layout.svelte
export function forceRoute(): string | null {
	if (!connected()) return LOGGIN_ROUTE;
	if (resolveTotpRequired) return LOGGIN_TOTP_ROUTE;
	return null;
}

export function isBlocked(pathname: string): boolean {
	return loggedIn() && LOGGIN_ROUTES.includes(pathname);
}
