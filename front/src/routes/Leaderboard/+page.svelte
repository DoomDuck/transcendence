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
			score: -8000
		}
	];
</script>

<div id="leaderboard">
	<h4 id="title">Leaderboard</h4>
	<div id="leaderboard-entries">
		{#each entries as entry, i}
			<!-- <div class="leaderboard-entry"> -->
			<span class="user-place">{i + 1} - </span>
			<span class="user-name">{entry.user}</span>
			<span class="user-score">{entry.score}</span>
			<!-- </div> -->
		{/each}
	</div>
</div>

<style>
	:root {
		background-image: url('/starsSky.png');
		background-size: cover;
	}

	#title {
		display: block;
		text-align: center;
		font-family: 'Press start 2P';
		font-style: normal;
		color: #6028ff;
		-webkit-text-stroke: 1px #ff29ea;
		text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
		font-size: 3.5em;
	}

	#leaderboard-entries {
		width: 50%;
		height: auto;
		margin: auto;
		/* display: flex;
    flex-direction: column;
    justify-self: center;
    justify-content: flex-start;
    gap: 1em;*/
		display: grid;
		grid-template-columns: max-content 80% auto;
		gap: 0.5em;
		font-size: 2.5em;
	}

	.user-place {
		font-family: Avenir Medium;
		color: #fce7ff;
	}
	.user-name {
		background-color: #c8974d;
		justify-content: center;
	}
	.user-score {
		background-color: #7eb227;
	}
</style>
