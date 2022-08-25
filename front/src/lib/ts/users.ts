import { ChatEvent, type ChatUserDto, type Id, type RequestFeedbackDto } from 'backFrontCommon';
import { readable } from 'svelte/store';
import { state } from './state';

export class Users {
	private map: Map<Id, ChatUserDto> = new Map();
	constructor() {
		//DEBUG

		this.map.set(0, {
			id: 0,
			name: 'Maman',
			image: 'cars.jpeg',
			profile: {
				ranking: 0,
				matchHistory: [
					{
						opponent: 1,
						winner: true
					}
				]
			}
		});
		this.map.set(1, {
			id: 1,
			name: 'Victor',
			image: 'cars.jpeg',
			profile: {
				ranking: 2,
				matchHistory: [
					{
						opponent: 0,
						winner: false
					}
				]
			}
		});
		this.map.set(2, {
			id: 2,
			name: 'Jean-Reno',
			image: 'cars.jpeg',
			profile: {
				ranking: 1,
				matchHistory: []
			}
		});
	}

	async findOrFetch(id: number): Promise<ChatUserDto> {
		if (this.map.has(id)) return this.map.get(id) as ChatUserDto;
		const user = await fetchUser(id);
		this.map.set(id, user);
		return user;
	}
}

async function fetchUser(id: number): Promise<ChatUserDto> {
	const feedback: RequestFeedbackDto<ChatUserDto> = await new Promise((resolve) => {
		state.socket.emit(ChatEvent.GET_USER, { target: id }, (feedback) => resolve(feedback));
	});
	console.log('FEEDBACK:' + JSON.stringify(feedback));
	if (feedback.success) return feedback.result!;
	else {
		// DEBUG
		return {
			id: 9999,
			image: '',
			name: 'GOGO',
			profile: { ranking: 0, matchHistory: [] }
		};
	}
	// const result = await response.json();
}

export const usersObject = new Users();
export const users = readable(usersObject);
