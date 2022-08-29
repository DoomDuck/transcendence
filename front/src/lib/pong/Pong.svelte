<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ClientGameContextOnlineObserver,
		ClientGameContextOffline,
		ClientGameContextOnlinePlayer,
		ClientGameContext
	} from 'pong';
	import { joinGame, socket, gameParams } from '$lib/state';

	const online = gameParams!.online;
	const observe = gameParams!.observe ?? false;
	const matchmaking = gameParams!.matchMaking ?? false;
	const classic = gameParams!.classic ?? false;

	console.log(`online: ${online}`);
	console.log(`observe: ${observe}`);

	let visibilities = ['visible', 'hidden'];

	onMount(() => {
		if (matchmaking) joinGame(classic);

		const onFinish = () => {
			// SHOW THE FINISH SCREEN
			// DO THINGS
			// E.G.
			visibilities = ['hidden', 'visible'];
		};

		let ctx: ClientGameContext;
		if (online) {
			if (observe) ctx = new ClientGameContextOnlineObserver(socket!, onFinish);
			else ctx = new ClientGameContextOnlinePlayer(socket!, onFinish);
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
