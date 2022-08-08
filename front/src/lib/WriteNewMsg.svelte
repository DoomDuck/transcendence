<script lang="ts">
	import SendMessage from '$lib/SendNewMessage.svelte';
	import { ChatContext } from './ChatContext';
	import Modal from './Modal.svelte';

	export let context: ChatContext;
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
		<SendMessage text="" sendMessage={context.sendDirectMessage.bind(context)} />
	</Modal>
{/if}

<style>
	img {
		float: right;
	}
</style>
