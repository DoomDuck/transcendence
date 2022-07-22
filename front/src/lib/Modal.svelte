<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
</script>

<div id="background" on:click={() => dispatch('close')} />
<div id="modal">
	<slot />
</div>

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
		width: 280px;
		transform: translate(-50%, -50%);
		background: #fff;
		filter: drop-shadow(0 0 20px #333);
		overflow-x: hidden;
		overflow-y: auto;
	}
</style>
