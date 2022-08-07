<script lang="ts">
	import Pong from '$lib/Pong.svelte';
</script>

<div id="Play">
	<Pong online={true} observe={true} />
</div>

<style>
	#Play {
		/* transform: translateX(); */
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-image: url('/gameBackground.png');
		overflow: hidden;
	}
</style>
