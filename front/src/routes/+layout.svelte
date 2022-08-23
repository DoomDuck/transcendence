<script>
	import GameInvitePopups from '$lib/GameInvitePopups.svelte';
</script>

<div id="background">
  <slot/>
	<GameInvitePopups />
</div>

<style>
	#background {
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100%;
		height: 100%;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
	}
  
  :global(h1, h2, h3, h4)  {
		font-family: 'Press Start 2P';
		font-style: normal;
		color: #6028FF;
  }

	:global(h1) {
		line-height: 300%;
		-webkit-text-stroke: 2px #ff29ea;
		text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
		font-size: 6vh;
	}

	:global(h4) {
		line-height: 350%;
		-webkit-text-stroke: 1px #ff29ea;
		text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
		font-size: 3.5vh;
	}
</style>
