<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import SelectDurationModal from '../modals/SelectDurationModal.svelte';

	let show: boolean = false;
</script>

<button on:click={() => (show = true)}>
	<slot />
</button>

<Modal bind:show>
	<SelectDurationModal bind:show on:selectDuration />
</Modal>
