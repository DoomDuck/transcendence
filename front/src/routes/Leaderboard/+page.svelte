<script lang="ts">
	let entries = [
		{
			user: 'Jessica',
			score: 175
		},
		{
			user: 'XXXRamboXXX',
			score: 120
		},
		{
			user: 'PoulpeMan',
			score: 10
		},
		{
			user: 'MaVieCestDla****',
			score: -8
		}
	];
</script>

<div id="leaderboard">
	<h1>Leaderboard</h1>
	<div id="leaderboard-entries">
		{#each entries as entry, i}
			<div class="user">
				<span class="user-place">{i + 1} </span>
				<span class="user-name">{entry.user}</span>
				<span class="user-score">{entry.score}</span>
			</div>
		{/each}
	</div>
</div>

<style>

	#leaderboard{
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#leaderboard-entries {
		display: flex;
		flex-direction: column;
	}

	.user{
		font-family: 'Press start 2P';
		display: flex;
		flex-direction: row;
		gap: 2vh;
		text-align: center;
		font-size: 1.5em;
	}

	.user-place {
		font-family: 'Press start 2P';
		color: #ff29ea;
		margin-left: 2px;
	}
	.user-name {
		color: #4d4dff;
		-webkit-text-stroke: 1px #ff29ea;
		width: 45vw;
		overflow-x: hidden;
	}
	.user-score {
		font-family: 'Press start 2P';
		color: #fff047;
	}
</style>
