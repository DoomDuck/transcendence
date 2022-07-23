<script lang="ts">
	export let image: string;
	export let friendName: string;
	export let iD = 35214;
	export let bestScore = 359;
	export let wonGamesRatio = '50%';
	export let classement = '3';
	let opponentHistoric = [
		{ name: 'Rob', myScore: 148, opponentScore: 75 },
		{ name: 'Ted', myScore: 25, opponentScore: 248 },
		{ name: 'Sam', myScore: 95, opponentScore: 24 }
	];
</script>

<div id="Profile">
	<div>
		<img class="roundedImageProfile" src={image} alt="profilepic" />
		<h3>{friendName}</h3>
		<p>iD: {iD}</p>
	</div>
	<hr width="200px" />
	<div id="statisticsLine">
		<div class="stats">
			<p class="statsValue">
				{bestScore}
			</p>
			<p>Best Score</p>
		</div>
		<div class="stats">
			<p class="statsValue">
				#{classement}
			</p>
			<p>Classement</p>
		</div>
		<div class="stats">
			<p class="statsValue">
				{wonGamesRatio}
			</p>
			<p>Won Games</p>
		</div>
	</div>
	<hr width="200px" />
	{#each opponentHistoric as { name, myScore, opponentScore }}
		<p class="gameHistoric">{name} {opponentScore} - {myScore}</p>
	{/each}
</div>

<style>
	h3 {
		color: #ff00b8;
		text-align: center;
		line-height: 0px;
	}

	p {
		color: #c9c7c7;
		text-align: center;
		font-size: smaller;
		line-height: 0%;
	}

	.roundedImageProfile {
		overflow: hidden;
		border-radius: 4em;
		width: 6em;
		height: 6em;
		margin-top: 2%;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 0%;
		display: block;
	}

	#Profile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-family: 'Lato', sans-serif;
	}

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

	.gameHistoric {
		display: flex;
		flex-direction: row;
		justify-content: space-around;
	}
</style>
