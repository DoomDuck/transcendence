<script lang="ts">
	export let image: string;
	export let friendName: string;
	export let iD = 35214;
	export let bestScore;
	export let wonGamesRatio;
</script>

<div id="Profile">
	<div>
		
		<img class="roundedImageProfile" src={image} alt="profilepic" />
		<h3>{friendName}</h3>
		<p>iD: {iD}</p>
	</div>
		<hr width=200px/>

</div>

<style>
	#Profile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow-y: scroll;
		font-family: 'Lato', sans-serif;
	}
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
</style>
