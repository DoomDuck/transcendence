<script lang="ts">
	import Pong from '$lib/pong/Pong.svelte';
	import { gameParamsAreValid } from '$lib/ts/gameParams';
	import { state } from '$lib/ts/state';
	import { ChatEvent } from 'backFrontCommon';
	import { onMount } from 'svelte';

	let background = state.gameParams?.classic ? '/starsSky.png' : '/gameBackground.png';
	// background = `url(${background})`;

	onMount(() => {
		if (!gameParamsAreValid(state.gameParams))
			// TODO: ERROR PAGE
			throw Error('INVALID GAME PARAMS');
	});
</script>

<div id="Play" style="--background: url({background})">
	<Pong />
</div>

<style>
	#Play {
		background-image: var(--background);
		transform: translateX();
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-size: cover;
		overflow: hidden;
	}
</style>
