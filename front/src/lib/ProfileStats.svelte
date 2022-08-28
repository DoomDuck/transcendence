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
	p {
		color: #c9c7c7;
		text-align: center;
		font-size: smaller;
		line-height: 0%;
	}
</style>
