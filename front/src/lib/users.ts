import { type ChatUserDto, type Id } from 'backFrontCommon';
import { readable } from 'svelte/store';

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
	const response = await fetch(`http://localhost:5000/user/${id}`, { method: 'GET' });
	const result = await response.json();
	console.log(JSON.stringify(response));
	return result;
}

export const usersObject = new Users();
export const users = readable(usersObject);
