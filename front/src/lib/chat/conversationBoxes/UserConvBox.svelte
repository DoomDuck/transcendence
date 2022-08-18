<script lang="ts">
	import { beforeUpdate, afterUpdate, createEventDispatcher } from 'svelte';
	import GameInvit from '$lib/GameInvitBox.svelte';
	import Modal from '$lib/Modal.svelte';
	import { UserConversation } from '$lib/utils';
	import ConversationEntry from './ConversationEntry.svelte';
	import type { DMToServer } from 'backFrontCommon/chatEvents';
	import BlockUser from '../buttons/BlockUserButton.svelte';

	export let conversation: UserConversation;

	const dispatch = createEventDispatcher<{ msgToUser: DMToServer }>();
	let gameInvitModal = false;
	let div: HTMLDivElement;
	let autoscroll: boolean;

	beforeUpdate(() => {
		autoscroll = div && div.offsetHeight + div.scrollTop > div.scrollHeight - 20;
	});

	afterUpdate(() => {
		if (autoscroll) div.scrollTo(0, div.scrollHeight);
	});

	function handleKeydown(event: KeyboardEvent) {
		const inputElement = event.target as HTMLInputElement;
		if (event.key === 'Enter') {
			const content = inputElement.value;
			inputElement.value = '';
			if (!content) return;

			dispatch('msgToUser', {
				target: conversation.dto.interlocutor,
				content
			});
		}
	}
</script>

<!-- to refacto -->
<div class="chat">
	<div id="title">
		{#await conversation.getInterlocuterAsDto()}
			<h2>...</h2>
		{:then user}
			<h2>{user.name}</h2>
			<div id="options">
				<!-- <img src="blockingIcon.png" alt="block user" width="25px" height="25px" /> -->
				<BlockUser {user} />
				<img
					src="joystick.png"
					alt="invite friend to play"
					width="30px"
					height="30px"
					on:click={() => (gameInvitModal = true)}
				/>
			</div>
		{/await}
	</div>
	<div class="scrollable" bind:this={div}>
		{#each conversation.history as message}
			<ConversationEntry {message} showAuthor={false} />
		{/each}
	</div>

	<input on:keydown={handleKeydown} />
</div>

<Modal bind:show={gameInvitModal}>
	<!-- to change  -->
	<GameInvit name={`${conversation.dto.interlocutor}`} />
</Modal>

<style>
	.chat {
		display: flex;
		flex-direction: column;
		height: 50vh;
		font-family: 'Lato', sans-serif;
		width: 500px;
	}

	.scrollable {
		flex: 1 1 auto;
		border-top: 1px solid #eee;
		margin: 0 0 0.5em 0;
		overflow-y: auto;
		overflow-x: hidden;
	}

	#title {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		padding: 0.5vw;
	}

	#options {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 12px;
	}
</style>
