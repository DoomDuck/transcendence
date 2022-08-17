<script lang="ts">
	// import { setContext } from 'svelte';
	// import type { ClientToServerEvents, ServerToClientEvents } from 'backFrontCommon';
	// import { chatContextKey, type ChatSocket } from '$lib/utils';
	import { users } from '$lib/users';

	let color: string = '#6028FF';

	// let tokenInput: string | undefined;
	// do {
	// 	tokenInput = prompt('your token ?')?.trim();
	// } while (
	// 	!(
	// 		tokenInput !== undefined &&
	// 		tokenInput.length > 0 &&
	// 		Number.isInteger(+tokenInput) &&
	// 		+tokenInput >= 0
	// 	)
	// );
	// const socket: ChatSocket = io('http://localhost:5000/chat', {
	// 	auth: { token: tokenInput }
	// });
	// setContext(chatContextKey, {
	//   socket,
	//   token: tokenInput as string
	// })
</script>

<nav id="menu">
	<h1 class="typography" style="color: {color}">Transcendence</h1>
	<h4 class="typography" style="color: {color}">
		<a sveltekit:prefetch href="/StartAGame">Game</a>
	</h4>
	<h4 class="typography" style="color: {color}">
		<a sveltekit:prefetch href="/Chat">Chat</a>
	</h4>
	<h4 class="typography" style="color: {color}">
		<a sveltekit:prefetch href="/Parameters">Parameters</a>
	</h4>
</nav>

<style>
	#menu {
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.typography {
		font-family: 'Press Start 2P';
		font-style: normal;
	}

	h1 {
		line-height: 300%;
		-webkit-text-stroke: 2px #ff29ea;
		text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
		font-size: 6vh;
	}

	h4 {
		line-height: 350%;
		-webkit-text-stroke: 1px #ff29ea;
		text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
		font-size: 3.5vh;
	}

	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}
	a {
		all: unset;
	}
</style>
