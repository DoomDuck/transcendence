<script lang="ts">
	import { goto } from '$app/navigation';
	import { gameParams } from '$lib/state';
	// import { onMount } from 'svelte';
	// import { gameParamsAreValid } from '$lib/ts/gameParams';

	function play(classic: boolean) {
		// TODO: ERROR PAGE
		// if (!gameParamsAreValid(state.gameParams))
		//   goto('/StartAGame');
		gameParams!.classic = classic;
		goto('/Play');
	}
</script>

<h4><div on:click={() => play(true)}>Classic</div></h4>
<h4><div on:click={() => play(false)}>Weird</div></h4>

<style>
	h4 {
		line-height: 300%;
	}

	h4:hover {
		background-color: blue;
		width: 100%;
		text-align: center;
	}
</style>
