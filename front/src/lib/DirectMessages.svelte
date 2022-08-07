<script lang="ts">
	import Profile from './Profile.svelte';
	import Modal from './Modal.svelte';
	import Conversation from './Conversation.svelte';

	export let image = 'cars.jpeg';
	// export let id: number;
	export let name: string;
	// export let chatmessage: {
	// 	sender: number,
	// 	content:string
	// };
	export let hasNewMessage = false;

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
	<h5>{name}</h5>
	{#if hasNewMessage}
		<img class="notif" src="notification.png" alt="notif" width="35" height="35" />
	{/if}
</div>

{#if showProfile}
	<Modal on:close={() => (showProfile = false)}>
		<Profile {image} {name} />
	</Modal>
{/if}
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
