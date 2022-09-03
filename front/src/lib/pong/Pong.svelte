<script lang="ts">
	import { onMount } from 'svelte';
	import {
		ClientGameContextOnlineObserver,
		ClientGameContextOffline,
		ClientGameContextOnlinePlayer,
		ClientGameContextOnline,
		ClientGameContext
	} from 'pong';
	import { goto } from '$app/navigation';
	import { joinGame, socket, gameParams } from '$lib/state';
	import { delay } from 'pong/common/utils';

	const online = gameParams!.online;
	const observe = gameParams!.observe ?? false;
	const matchmaking = gameParams!.matchMaking ?? false;
	const classic = gameParams!.classic ?? false;

	let gameIsOver: boolean = false;
	// let gameIsOver = true;
	let gameOverText: string;
	let gameOverScoreDisplay: string;

	onMount(() => {
		// TODO: check if needed
		if (matchmaking) joinGame(classic);

		const onFinish = (score1: number, score2: number) => {
			const winner = score1 >= score2 ? 0 : 1;
			if ((online && observe) || !online) {
				gameOverText = `The winner is Player ${winner + 1}`;
				gameOverScoreDisplay = `${score1} - ${score2}`;
			} else {
				const playerId = (ctx as ClientGameContextOnlinePlayer).playerId!;
				gameOverText = winner == playerId ? 'You won !' : 'You lost, like a looser :(';
				let sideStrings = ['You', 'Opponent'];
				if (playerId == 1) sideStrings = [sideStrings[1], sideStrings[0]];
				gameOverScoreDisplay = `(${sideStrings[0]}) ${score1} - ${score2} (${sideStrings[1]})`;
			}
			gameIsOver = true;
			delay(5000).then(() => goto('/Main'));
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

		return () => {
			if (!gameIsOver && online) {
				(ctx as ClientGameContextOnline).exitGame();
			}
		};
	});
</script>

<div id="game-container">
	{#if !gameIsOver}
		<canvas id="game-background" />
		<canvas id="game-screen" />
	{:else}
		<div id="gameover-screen">
			<span>Game Over</span>
			<span>{gameOverText}</span>
			<span>{gameOverScoreDisplay}</span>
		</div>
	{/if}
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
		display: flex;
		flex-direction: column;
		justify-content: space-around;
		text-align: center;
		column-gap: 10px;
	}
	span {
		font-size: larger;
	}
</style>
