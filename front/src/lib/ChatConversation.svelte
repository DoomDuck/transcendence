<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	import Profile from './Profile.svelte';
	import Modal from './Modal.svelte';
	import ConvChat from './ConvChat.svelte';

	export let friendName: string;
	export let image: string;

	let showProfile = false;
	let openConv = false;
	export let hasNewMessage = false;
</script>

<div class="conv" on:click={() => (openConv = true)}>
	<img
		class="roundedImageConv"
		src={image}
		alt="contact"
		on:click={() => ((openConv = false), dispatch('close'), (showProfile = true))}
	/>
	<h5>{friendName}</h5>
	{#if showProfile}
		<Modal on:close={() => (showProfile = false)}>
			<Profile {image} {friendName} />
		</Modal>
	{/if}
	{#if hasNewMessage}
		<img class="notif" src="notification.png" alt="notif" width="35" height="35" />
	{/if}
</div>
{#if !showProfile && openConv}
	<Modal on:close={() => (openConv = false)}>
		<ConvChat {friendName} />
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
		background: white;
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
		-moz-border-radius: 50px;
		border-radius: 30px;
		width: 60px;
		height: 60px;
		margin-left: 1%;
		margin-right: 2%;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
