<script lang="ts">
	import type { ChatProfileDto } from 'backFrontCommon';

	// export let bestScore = 359;
	export let profile: ChatProfileDto;
	// let opponentHistory = [
	// 	{ name: 'Rob', myScore: 148, opponentScore: 75 },
	// 	{ name: 'Ted', myScore: 25, opponentScore: 248 },
	// 	{ name: 'Sam', myScore: 95, opponentScore: 24 }
	// ];
	let opponentHistory =
		profile.matchHistory.length <= 3 ? profile.matchHistory : profile.matchHistory.slice(-3);
</script>

<div>
	<hr width="200px" />
	<div id="statisticsLine">
		<div class="stats">
			<p>Classement</p>
			<p class="statsValue">
				#{profile.ranking}
			</p>
		</div>
	</div>
	<hr width="200px" />
	{#each opponentHistory as { opponent, winner }}
		<p class="gameHistory">{opponent} {winner ? 'Won :)' : 'Lost :('}</p>
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
