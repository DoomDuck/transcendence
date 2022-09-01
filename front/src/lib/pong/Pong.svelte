<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ClientGameContextOnlineObserver,
		ClientGameContextOffline,
		ClientGameContextOnlinePlayer,
		ClientGameContext
	} from 'pong';
	import { goto } from '$app/navigation';
	import { joinGame, socket, gameParams } from '$lib/state';
	import { delay } from 'pong/common/utils';

	const online = gameParams!.online;
	const observe = gameParams!.observe ?? false;
	const matchmaking = gameParams!.matchMaking ?? false;
	const classic = gameParams!.classic ?? false;

	let visibilities = ['visible', 'hidden'];

	onMount(() => {
		// TODO: check if needed
		if (matchmaking) joinGame(classic);

		const onFinish = () => {
			visibilities = ['hidden', 'visible'];
			delay(1000).then(() => goto('/Main'));
		};
		const onError = (message: string) => {
			alert(message);
			delay(1000).then(() => goto('/Main'));
		};

		let ctx: ClientGameContext;
		if (online) {
			if (observe) ctx = new ClientGameContextOnlineObserver(socket!, onFinish, onError);
			else ctx = new ClientGameContextOnlinePlayer(socket!, onFinish, onError);
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
