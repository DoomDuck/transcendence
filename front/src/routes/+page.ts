// import { state } from '$lib/state';
// import { redirect } from '@sveltejs/kit';
// import type { LoadEvent } from "@sveltejs/kit";

// export function load({url}: LoadEvent) {
//   console.log("Hello");
//   const route = state.forceRoute();
//   console.log(route);
//   if (route && route !== url.pathname)
//     throw redirect(307, route);
// }