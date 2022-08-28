import { goto } from '$app/navigation';
import { browser } from '$app/env';
import { state, LOGGIN_SUCCESS_ROUTE } from '$lib/ts/state';
import { redirect } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import { users, usersObject } from '$lib/ts/users';

function safe_redirect(route: string) {
	if (!browser) throw redirect(307, route);
	goto(route);
}

export function load({ url }: LoadEvent) {
	// TODO remove
	usersObject.map.clear();
	usersObject.me = undefined;
	// (TODO)
	const route = state.forceRoute();
	if (route && route !== url.pathname) {
		safe_redirect(route);
		return;
	}
	if (state.isBlocked(url.pathname)) safe_redirect(LOGGIN_SUCCESS_ROUTE);
}
