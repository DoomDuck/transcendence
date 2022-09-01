import { goto } from '$app/navigation';
import { browser } from '$app/env';
import { forceRoute, isBlocked, LOGGIN_SUCCESS_ROUTE } from '$lib/state';
import { redirect } from '@sveltejs/kit';
import type { LoadEvent } from '@sveltejs/kit';
import { connected, updateMyself, clearUserCache } from '$lib/state';

function safe_redirect(route: string) {
	if (!browser) throw redirect(307, route);
	goto(route);
}

export function load({ url }: LoadEvent) {
	// TODO: find a better way
	if (connected()) {
		clearUserCache();
		updateMyself();
	}
	const route = forceRoute();
	if (route && route !== url.pathname) {
		safe_redirect(route);
		return;
	}
	if (isBlocked(url.pathname)) safe_redirect(LOGGIN_SUCCESS_ROUTE);
}
