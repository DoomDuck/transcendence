<script lang="ts">
	import { beforeUpdate, afterUpdate, createEventDispatcher } from 'svelte';
	import GameInvit from '$lib/GameInvitBox.svelte';
	import Modal from '$lib/Modal.svelte';
	import { UserConversation } from '$lib/utils';
	import ConversationEntry from './ConversationEntry.svelte';
	import type { DMToServer } from 'backFrontCommon/chatEvents';

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

	let userDtoPromise = conversation.getInterlocuterAsDto();
</script>

<div class="chat">
	<div id="title">
		<h2>
			{#await userDtoPromise}
				...
			{:then user}
				{user.name}
			{/await}
		</h2>
		<div id="options">
			<img src="blockingIcon.png" alt="block user" width="25px" height="25px" />
			<img
				src="joystick.png"
				alt="invite friend to play"
				width="30px"
				height="30px"
				on:click={() => (gameInvitModal = true)}
			/>
		</div>
	</div>
	<div class="scrollable" bind:this={div}>
		{#each conversation.history as comment}
			<ConversationEntry isMe={comment.isMe} text={comment.content} />
		{/each}
	</div>

	<input on:keydown={handleKeydown} />
</div>

{#if gameInvitModal}
	<Modal on:close={() => (gameInvitModal = false)}>
		<!-- to change  -->
		<GameInvit name={`${conversation.dto.interlocutor}`} />
	</Modal>
{/if}

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
