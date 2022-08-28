import {
	ChatEvent,
	type UserInfo,
	type Id,
	type RequestFeedbackDto,
	type MyInfo,
	GetInfoEvent
} from 'backFrontCommon';
import { readable, writable } from 'svelte/store';
import { state } from './state';

export class Users {
	// TODO: private
	public map: Map<Id, UserInfo> = new Map();
	public me?: MyInfo;

	constructor() {
		//DEBUG
		this.map.set(0, {
			id: 0,
			name: 'Maman',
			avatar: 'cars.jpeg',
			loose: 0,
			win: 10,
			score: 10,
			isOnline: true,
			inGame: true,
			ranking: 0,
			matchHistory: [
				{
					opponent: 1,
					opponentScore: 1,
					winner: true,
					score: 3
				},
				{
					opponent: 2,
					opponentScore: 3,
					winner: false,
					score: 0
				}
			]
		});
		this.map.set(1, {
			id: 1,
			name: 'Victor',
			avatar: 'cars.jpeg',
			loose: 5,
			win: 5,
			score: 0,
			isOnline: true,
			inGame: true,
			ranking: 1,
			matchHistory: []
		});
		this.map.set(2, {
			id: 2,
			name: 'Jean-Reno',
			avatar: 'cars.jpeg',
			loose: 10,
			win: 0,
			score: -10,
			isOnline: true,
			inGame: true,
			ranking: 2,
			matchHistory: []
		});
	}

	static errorUser(id: number): UserInfo {
		return {
			id,
			name: 'Error',
			avatar: 'errorUser.png',
			loose: 0,
			win: 0,
			score: 0,
			isOnline: false,
			inGame: true,
			ranking: 0,
			matchHistory: []
		};
	}

	static errorMe(): MyInfo {
		return {
			id: 0,
			name: 'Error',
			avatar: 'errorUser.png',
			loose: 0,
			win: 0,
			score: 0,
			inGame: false,
			blocked: [],
			friendlist: [],
			totpSecret: '',
			ranking: 0
		};
	}

	async findOrFetch(id: number): Promise<UserInfo> {
		if (this.map.has(id)) return this.map.get(id) as UserInfo;
		const user = await fetchUser(id);
		this.map.set(id, user);
		return user;
	}

	async findOrFetchMyself(): Promise<MyInfo> {
		if (this.me !== undefined) return this.me;
		this.me = await fetchMe();
		return this.me;
	}
}

async function fetchUser(id: number): Promise<UserInfo> {
	const feedback: RequestFeedbackDto<UserInfo> = await new Promise((resolve) => {
		state.socket.emit(GetInfoEvent.USER_INFO, { target: id }, resolve);
	});
	console.log('FEEDBACK:' + JSON.stringify(feedback));
	if (feedback.success) return feedback.result!;
	else return Users.errorUser(id);
}

async function fetchMe(): Promise<MyInfo> {
	const feedback: RequestFeedbackDto<MyInfo> = await new Promise((resolve) => {
		state.socket.emit(GetInfoEvent.MY_INFO, resolve);
	});
	console.log('FEEDBACK:' + JSON.stringify(feedback));
	if (feedback.success) return feedback.result!;
	else return Users.errorMe();
}

export let usersObject = new Users();
export const users = writable(usersObject);
users.subscribe((_) => (usersObject = _));

export async function isInGame(userId: Id): Promise<boolean> {
	const feedback: RequestFeedbackDto<boolean> = await new Promise((resolve) => {
		state.socket.emit(GetInfoEvent.IS_IN_GAME, { target: userId }, resolve);
	});
	if (feedback.success) return feedback.result!;
	else return false;
}

export async function refreshIngameStatus(userId: number) {
	const user = await usersObject.findOrFetch(userId);
	user.inGame = await isInGame(userId);
	console.log(`user.inGame = ${user.inGame}`);
	users.update((_) => _);
}
