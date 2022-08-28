<script lang="ts">
	import { goto } from '$app/navigation';

	import { ChatEvent, type UserInfo } from 'backFrontCommon';
	import { GameProducedEvent } from 'pong/common/game/events';
	import { onMount } from 'svelte';
	import { state } from './ts/state';
	import { isInGame, refreshIngameStatus } from './ts/users';
	export let user: UserInfo;

	$: userInGame = user.inGame;
	onMount(() => {
		isInGame(user.id).then((inGame) => (userInGame = inGame));
	});

	function observeGame() {
		state.socket.emit(ChatEvent.GAME_OBSERVE, user.id, (feedback) => {
			if (feedback.success) {
				state.gameParams = {
					online: true,
					observe: true
				};
				goto('/Play');
			} else {
				console.error(feedback.errorMessage);
			}
		});
	}
</script>

<div>
	<hr width="200px" />
	<div id="statisticsLine">
		<div class="stats">
			<p>Classement</p>
			<p class="statsValue">
				#{user.ranking}
			</p>
		</div>
	</div>
	<hr width="200px" />
	{#each user.matchHistory as { opponent, winner, score, opponentScore }}
		<p class="gameHistory">{opponent}: {winner ? 'Won' : 'Lost'} ({score} - {opponentScore})</p>
	{/each}
	{#if userInGame}
		<div id="statusLine">
			<p>Status: In Game</p>
			<button on:click={observeGame}> Watch </button>
		</div>
	{:else}
		<p>Status: Not in game</p>
	{/if}
</div>

<style>
	#statisticsLine {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	.stats {
		display: flex;
		flex-direction: column;
	}

	.statsValue {
		font-weight: bolder;
	}

	.gameHistory {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}

	#statusLine {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}

	p {
		color: #c9c7c7;
		text-align: center;
		font-size: smaller;
		line-height: 0%;
	}
</style>
