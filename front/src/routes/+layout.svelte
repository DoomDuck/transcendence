<script lang="ts">
	import { beforeNavigate } from '$app/navigation';
	import Popups from '$lib/Popups.svelte';
	import { gameParams, redirectMainInvalidateGameParams, updateAllStores } from '$lib/state';
	import { closeLastModal, modalCallbackStack } from '$lib/ts/modals';
	import { onMount } from 'svelte';

	beforeNavigate((navigation) => {
		if (!navigation.to) return;
		console.log(`Navigate to ${navigation.to.pathname}`);
		let cancelNavigation = false;
		if (navigation.to.pathname == '/Play') {
			cancelNavigation = !gameParams || !gameParams.valid;
		} else if (navigation.to.pathname == '/ChooseGameMode') {
			cancelNavigation = !gameParams || !gameParams.startAGame;
		} else if (navigation.to.pathname == '/WaitingRoom') {
			cancelNavigation = !gameParams || !gameParams.valid;
		}
		if (cancelNavigation) {
			navigation.cancel();
			redirectMainInvalidateGameParams();
			return;
		}
	});

	onMount(() => {
		const timeout = setInterval(updateAllStores, 1000);
		return () => clearInterval(timeout);
	});
</script>

<div id="background">
	<slot />
	<Popups />
	{#if $modalCallbackStack.length > 0}
		<div id="modal-background" on:click={closeLastModal} />
	{/if}
</div>

<style>
	#background {
		background-image: url('/starsSky.png');
		background-size: cover;
		width: 100%;
		height: 100%;
		overflow: auto;
	}

	#modal-background {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
	}

	:global(h1, h2, h3, h4) {
		font-family: 'Press Start 2P';
		font-style: normal;
		color: #6028ff;
	}

	:global(h1) {
		line-height: 500%;
		-webkit-text-stroke: 2px #ff29ea;
		text-shadow: 6px 6px 6px purple, 6px 6px 6px purple;
	}

	:global(h4) {
		line-height: 350%;
		-webkit-text-stroke: 1px #ff29ea;
		text-shadow: 5px 5px 5px purple, 5px 5px 5px purple;
	}

	:global(a) {
		all: unset;
	}
</style>
