<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { onDestroy } from 'svelte';

	export let show = false;

	let dispatch = createEventDispatcher();
	let close = () => {
		show = false;
		dispatch('close');
	};

	function handleKeydown(event: KeyboardEvent) {
		if (event.key == 'Escape') {
			close();
		}
	}
	window.addEventListener('keydown', handleKeydown);
	onDestroy(() => window.removeEventListener('keydown', handleKeydown));
</script>

{#if show}
	<div id="background" on:click={close} />
	<div id="modal">
		<slot />
	</div>
{/if}

<style>
	#background {
		position: fixed;
		z-index: 1;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background-color: rgba(0, 0, 0, 0.7);
	}

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
