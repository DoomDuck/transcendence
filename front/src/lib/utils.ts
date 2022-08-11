import type { UserType } from 'chat';
import { readable } from 'svelte/store';

type Id = number;

export class Users {
	private map: Map<Id, UserType> = new Map();
	constructor() {}

	async findOrFetch(id: number): Promise<UserType> {
		if (this.map.has(id)) return this.map.get(id) as UserType;
		const user = await fetchUser(id);
		this.map.set(id, user);
		return user;
	}
}

async function fetchUser(id: number): Promise<UserType> {
	const response = await fetch(`http://localhost:5000/user/${id}`, { method: 'GET' });
	const result = await response.json();
	console.log(JSON.stringify(response));
	return result;
}

export const users = readable(new Users());
