<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { newModal, removeModal } from './ts/modals';

	export let show = false;
	$: {
		if (show) newModal(close);
		else removeModal(close);
	}

	let dispatch = createEventDispatcher();
	function close() {
		show = false;
		dispatch('close');
	}
</script>

{#if show}
	<!-- <div id="background" on:click={close} /> -->
	<div id="modal">
		<slot />
	</div>
{/if}

<style>
	/* #background {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.7);
	} */

	#modal {
		position: fixed;
		z-index: 2;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		background: #fff;
		filter: drop-shadow(0 0 20px #333);
		overflow: hidden;
		font-family: 'Lato', sans-serif;
	}
</style>
