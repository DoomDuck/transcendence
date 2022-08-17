<script lang="ts">
	import Modal from '$lib/Modal.svelte';
	export let hasNewMessage: boolean = false;

	let showConv = false;
</script>

<div class="item" on:click={() => (showConv = true)}>
	<slot name="icon" />
	<slot name="item-text" />
	{#if hasNewMessage}
		<img class="notif" src="notification.png" alt="notif" />
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

	.notif {
		margin-left: auto;
		padding: 5%;
		width: 35px;
		height: 35px;
	}
</style>
