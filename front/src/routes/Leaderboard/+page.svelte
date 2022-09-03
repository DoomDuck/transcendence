<script lang="ts">
	import { sendGetLeaderboard } from '$lib/state';

	import { LeaderboardItemDto } from 'backFrontCommon';
	import { onMount } from 'svelte';

	let entries: LeaderboardItemDto[] = [];
	// let entries: LeaderboardItemDto[] = [
	//   {name: 'charly', id: 0, defeat: 6, victory: 10, score: 4},
	//   {name: 'charly', id: 0, defeat: 6, victory: 10, score: 4}
	// ];
	onMount(() => {
		sendGetLeaderboard().then((_) => (entries = _));
	});
</script>

<div id="leaderboard">
	<h1>Leaderboard</h1>
	<div id="leaderboard-entries-border">
		<div id="leaderboard-entries">
			<span>Rank</span>
			<span>Name</span>
			<span>Score</span>
			<span>Won</span>
			<span>Lost</span>
			{#each entries as entry, i}
				<span class="user-place numeric">{i + 1} </span>
				<span class="user-name">{entry.name}</span>
				<span class="user-score numeric">{entry.score}</span>
				<span class="user-victory-count numeric">+ {entry.victory}</span>
				<span class="user-defeat-count numeric">- {entry.defeat}</span>
			{/each}
		</div>
	</div>
</div>

<style>
	#leaderboard {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	#leaderboard-entries-border {
		background-color: white;
		padding: 1px;
	}

	#leaderboard-entries {
		font-family: 'Press start 2P';
		color: white;
		display: grid;
		grid-template-columns: 1fr 5fr 3fr 1fr 1fr;
		gap: 1px;
		text-align: center;
	}
	#leaderboard-entries > span {
		background-color: black;
		padding: 25px;
		overflow-x: hidden;
	}
	.user-name {
		color: #4d4dff;
		-webkit-text-stroke: 1px #ff29ea;
	}
	.user-score {
		background-color: #fff047;
	}
	.user-victory-count {
		background-color: #03fc03;
	}
	.user-defeat-count {
		background-color: #fc3003;
	}
	.numeric {
		color: white;
	}
</style>
