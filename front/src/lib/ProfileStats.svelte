<script lang="ts">
	import type { UserInfo } from 'backFrontCommon';
	import { onMount } from 'svelte';
	import { isInGame, refreshIngameStatus } from './ts/users';
	export let user: UserInfo;

	$: userInGame = user.inGame;
	onMount(() => {
		isInGame(user.id).then((inGame) => (userInGame = inGame));
	});
</script>

<div>
	<hr width="200px" />
	<div id="statisticsLine">
		<div class="stats">
			<div id='classement'>Classement</div>
			<div class="statsValue">
				#{user.ranking}
			</div>
		</div>
	</div>
	<hr width="200px" />
	{#each user.matchHistory as { opponent, winner, score, opponentScore }}
		<div class="gameHistory">{opponent}: {winner ? 'Won' : 'Lost'} ({score} - {opponentScore})</div>
	{/each}
	<p>Status: {userInGame ? 'In game' : 'Not in game'}</p>
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
	div {
		color: #c9c7c7;
		text-align: center;
	}
	hr{
		margin: 2px 25px;
	}
</style>
