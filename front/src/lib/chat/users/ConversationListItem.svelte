<script lang="ts">
	import Profile from '$lib/Profile.svelte';
	import Modal from '$lib/Modal.svelte';
	import ConversationBox from './ConversationBox.svelte';
	import type { ConversationType } from '$lib/types';

	// export let name: string;
	export let conversation: ConversationType;
	export let hasNewMessage = false;
	//
	export let image = 'cars.jpeg';

	let showProfile = false;
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
	<img class="roundedImageConv" src={image} alt="contact" on:click={() => (showProfile = true)} />
	<h5>{conversation.interlocutor}</h5>
	{#if hasNewMessage}
		<img class="notif" src="notification.png" alt="notif" width="35" height="35" />
	{/if}
</div>

{#if showProfile}
	<Modal on:close={() => (showProfile = false)}>
		<Profile {image} name={conversation.interlocutor} />
	</Modal>
{/if}
{#if openConv}
	<Modal on:close={() => (openConv = false)}>
		<ConversationBox {conversation} on:msgToUser />
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

	.roundedImageConv {
		overflow: hidden;
		-webkit-border-radius: 50px;
		/* -moz-border-radius: 50px; */
		border-radius: 30px;
		width: 60px;
		height: 60px;
		margin-left: 1%;
		margin-right: 2%;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
