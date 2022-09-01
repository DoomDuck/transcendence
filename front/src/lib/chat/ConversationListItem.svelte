<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	import NotificationIcon from './NotificationIcon.svelte';

	export let hasNewMessage: boolean = false;
	export let bannedFromChannel: boolean = false;

	let showConv = false;
	let thisRef: any;

	function handleClickOpenModal(event: MouseEvent) {
		if (event.target == thisRef) showConv = true;
	}

	$: {
		if (hasNewMessage && showConv) hasNewMessage = false;
	}
</script>

<div class="item" class:bannedFromChannel bind:this={thisRef} on:click={handleClickOpenModal}>
	<slot name="icon" />
	<slot name="item-text" />
	{#if hasNewMessage}
		<NotificationIcon />
	{/if}
</div>

<Modal bind:show={showConv}>
	<slot name="conversation-modal" />
</Modal>

<style>
	.item {
		align-items: center;
		width: 80vw;
		height: 70px;
		background: #040128;
		display: flex;
		border: 1px solid #ff00b8;
	}
	.bannedFromChannel {
		background: #a80a2f;
	}
</style>
