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
		<div class="gameHistory">
			Against {opponent}: {winner ? 'Victory' : 'Defeat'} ({score} - {opponentScore})
		</div>
	{/each}
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
	hr {
		margin: 2px 25px;
	}
</style>
