<script lang="ts">
	import SendMessage from '$lib/SendNewMessage.svelte';
	import Modal from './Modal.svelte';

	let sendingMessage = false;
</script>

<img
	src="pencil.png"
	width="40"
	height="40"
	alt="write msg"
	on:click={() => (sendingMessage = true)}
/>

{#if sendingMessage}
	<Modal on:close={() => (sendingMessage = false)}>
		<SendMessage newText="" sendMessage={() => {}} />
	</Modal>
{/if}

<style>
	img {
		float: right;
	}
</style>
