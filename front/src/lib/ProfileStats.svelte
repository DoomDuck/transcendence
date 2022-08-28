<script lang="ts">
	import type { UserInfo } from 'backFrontCommon';
	export let user: UserInfo;
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
