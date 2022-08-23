<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ClientGameContextOnlineObserver,
		ClientGameContextOffline,
		ClientGameContextOnlinePlayer,
		ClientGameContext
	} from 'pong';
	import { state } from '$lib/ts/state';
	export let online: boolean;
	export let observe: boolean;

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

		let ctx: ClientGameContext;
		if (online) {
			if (observe) ctx = new ClientGameContextOnlineObserver(state.socket, onFinish);
			else ctx = new ClientGameContextOnlinePlayer(state.socket, onFinish);
		} else ctx = new ClientGameContextOffline(onFinish);
		ctx.animate();
		ctx.startGame();
	});
</script>

<div id="game-container">
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
	#game-screen {
		position: absolute;
	}
	#gameover-screen {
		position: absolute;
		background-color: white;
	}
	/* .player-score {
    color: rgb(255, 255, 255);
    font-family: sans-serif;
    background: rgba(0, 0, 0, 0);
} */
</style>
