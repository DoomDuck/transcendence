<script lang="ts">
	import Pong from '$lib/pong/Pong.svelte';
	import { gameParamsAreValid } from '$lib/ts/gameParams';
	import { gameParams, redirectHome } from '$lib/state';
	import { onMount } from 'svelte';
	import { delay } from 'pong/common/utils';

	let background = gameParams?.classic ? '/starsSky.png' : '/gameBackground.png';

	onMount(() => {
		if (!gameParamsAreValid(gameParams!)) {
			alert('Invalid game params');
			delay(1000).then(() => redirectHome());
		}
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
