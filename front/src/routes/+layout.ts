import { goto } from '$app/navigation';
import { browser } from '$app/env';
import { state } from '$lib/state';
import { redirect } from '@sveltejs/kit';
import type { LoadEvent } from "@sveltejs/kit";

export function load({url}: LoadEvent) {
    const route = state.forceRoute();
    if (!(route && route !== url.pathname)) return;
    if (!browser) throw redirect(307, route);
    goto(route);
}