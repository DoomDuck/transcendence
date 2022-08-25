<script lang="ts">
	import type { UserInfo } from 'backFrontCommon';
	export let user: UserInfo;
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
