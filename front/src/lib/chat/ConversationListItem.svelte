<script lang="ts">
	import Profile from '$lib/Profile.svelte';
	import Modal from '$lib/Modal.svelte';
	import {
		ChannelConversation,
		type DisplayableConversation,
		type UserConversation
	} from '../utils';
	import ConversationBox from './ConversationBox.svelte';
	import ChannelBox from './ChannelBox.svelte';

	// export let name: string;
	export let conversation: UserConversation | ChannelConversation;
	export let hasNewMessage = false;
	//
	export let image = 'cars.jpeg';

	let showProfile = false;
	let showConv = false;

	function openProfile() {
		if (!showConv) showProfile = true;
	}
	function openConv() {
		if (!showProfile) showConv = true;
	}
</script>

<!-- on:click={(e) => {
    openConv
		// if (e.target == e.currentTarget) {
			showConv = true;
		// }
	}} -->
<div class="conv" on:click={openConv}>
	<img class="roundedImageConv" src={image} alt="contact" on:click={openProfile} />
	<h5>{conversation.displayName}</h5>
	{#if hasNewMessage}
		<img class="notif" src="notification.png" alt="notif" width="35" height="35" />
	{/if}
</div>

{#if showProfile}
	<Modal on:close={() => (showProfile = false)}>
		<Profile {image} name={conversation.displayName} />
	</Modal>
{/if}
{#if showConv}
	<Modal on:close={() => (showConv = false)}>
		{#if conversation instanceof ChannelConversation}
			<ChannelBox {conversation} on:msgToChannel />
		{:else}
			<ConversationBox {conversation} on:msgToUser />
		{/if}
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
