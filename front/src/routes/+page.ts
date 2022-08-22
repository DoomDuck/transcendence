import { } from '$lib/login';
import { redirect } from '@sveltejs/kit';
import type { LoadEvent } from "@sveltejs/kit";

export function load({url}: LoadEvent) {
  if (url.pathname !== '/') {
    throw redirect(307, '/');
  }
}