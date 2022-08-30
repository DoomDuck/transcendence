<script lang="ts">
	import { UserInfo } from 'backFrontCommon';
	import { observeGame } from '$lib/state';

	export let user: UserInfo;
</script>

<div>
	<hr width="200px" />
	<div id="statisticsLine">
		<div class="stats">
			<div id="classement">Classement</div>
			<div class="statsValue">
				#{user.ranking}
			</div>
		</div>
	</div>
	<hr width="200px" />
	{#each user.matchHistory as { opponent, winner, score, opponentScore }}
		<div class="gameHistory">{opponent}: {winner ? 'Won' : 'Lost'} ({score} - {opponentScore})</div>
	{/each}
	{#if user.inGame }
		<div id="statusLine">
			<p>Status: In Game</p>
			<button on:click={() => observeGame(user.id)}> Watch </button>
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
	}
	hr {
		margin: 2px 25px;
	}
</style>
