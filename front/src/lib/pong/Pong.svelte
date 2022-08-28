<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import {
		ClientGameContextOnlineObserver,
		ClientGameContextOffline,
		ClientGameContextOnlinePlayer,
		ClientGameContext
	} from 'pong';
	import { state } from '$lib/ts/state';
	import { ChatEvent } from 'backFrontCommon';
	import { delay } from 'pong/common/utils';
	import { goto } from '$app/navigation';

	const online = state.gameParams!.online;
	const observe = state.gameParams!.observe ?? false;
	const classic = state.gameParams!.classic ?? false;

	console.log(`online: ${online}`);
	console.log(`observe: ${observe}`);

	let visibilities = ['visible', 'hidden'];

	onMount(() => {
		const onFinish = () => {
			// SHOW THE FINISH SCREEN
			// DO THINGS
			// E.G.
			visibilities = ['hidden', 'visible'];
		};
		const onError = (message: string) => {
			delay(1000).then(() => goto('/Main'));
			alert(message);
		};

		let ctx: ClientGameContext;
		if (online) {
			if (observe) ctx = new ClientGameContextOnlineObserver(state.socket, onFinish, onError);
			else ctx = new ClientGameContextOnlinePlayer(state.socket, onFinish, onError);
		} else ctx = new ClientGameContextOffline(onFinish, classic);
		ctx.animate();
		ctx.startGame();
	});
</script>

<div id="game-container">
	<canvas id="game-background" style="visibility: {visibilities[0]}" />
	<canvas id="game-screen" style="visibility: {visibilities[0]}" />
	<div id="gameover-screen" style="visibility: {visibilities[1]}">
		<p>Game<br />Over</p>
	</div>
</div>

<style>
	#game-container {
		width: 67%;
		height: 67%;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#game-background {
		position: absolute;
		z-index: 1;
	}
	#game-screen {
		position: absolute;
		z-index: 2;
	}
	#gameover-screen {
		position: absolute;
		background-color: white;
	}
</style>
