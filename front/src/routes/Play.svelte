<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import Pong from '$lib/Pong.svelte';
	const dispatch = createEventDispatcher();
</script>

<div id="Play">
	<Pong />
	<img
		on:click={() => dispatch('start_game')}
		src="img/return.png"
		id="return"
		alt="return"
		width="30"
		height="30"
	/>
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
		background-image: url('gameBackground.png');
		overflow: hidden;
	}
	img {
		float: right;
		margin-right: 7%;
		margin-top: 3%;
	}
	#return {
		float: left;
		margin-left: 3%;
	}
</style>
