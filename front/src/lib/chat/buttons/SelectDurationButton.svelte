<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import SelectDurationModal from '../modals/SelectDurationModal.svelte';
	
	export let source: string;
	let show: boolean = false;
</script>

<img src={source} alt='mute or ban User' width=30 height=30 on:click={() => (show = true)}/>

<Modal bind:show>
	<SelectDurationModal bind:show on:selectDuration />
</Modal>
