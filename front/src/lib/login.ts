import { readable } from 'svelte/store';
import type { Readable } from 'svelte/store';

export const credentials: Readable<null | string> = readable(null);

export async function get_token(code: string) : Promise<string> {
	const response = await fetch(`${window.location.origin}/login?code=${code}`);
	const data = await response.json();
	if (!data.success)
		throw Error("Could not exchange code for token");
	return data.message;
}

// Login if request_login has been successful
// Throws an exception on failure
export async function login() : Promise<boolean> {
	let code = new URLSearchParams(document.location.search)
		.get("code");

	if (!code)
		return false;
	
	await get_token(code);
  
	return false;
}

export async function request_login() {
		const LOCATION = 'https://api.intra.42.fr/oauth/authorize';
		const REDIRECT = encodeURIComponent(window.location.origin);
		const CLIENT_ID = (window as any).env.PUBLIC_42_APP_ID as string;
		const URL = `${LOCATION}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT}&response_type=code`;

		window.history.pushState({}, '');
		window.location.assign(URL);
}
