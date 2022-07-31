<script lang="ts">
	import Modal from './Modal.svelte';
	import Conversation from './Conversation.svelte';

	export let name: string;
	export let hasNewMessage = false;

	let openConv = false;
</script>

<div
	class="conv"
	on:click={(e) => {
		if (e.target == e.currentTarget) {
			openConv = true;
		}
	}}
>
	<img class="imageConv" src="groupIcon.png" alt="contact" />
	<h5>{name}</h5>
	{#if hasNewMessage}
		<img class="notif" src="notification.png" alt="notif" width="35" height="35" />
	{/if}
</div>

{#if openConv}
	<Modal on:close={() => (openConv = false)}>
		<Conversation {name} />
	</Modal>
{/if}

<style>
	h5 {
		font-size: 1em;
		color: #ff00b8;
	}

	img {
		float: right;
		justify-content: right;
	}

	.conv {
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
	}

	.imageConv {
		overflow: hidden;
		width: 60px;
		height: 60px;
		margin-left: 1%;
		margin-right: 2%;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
