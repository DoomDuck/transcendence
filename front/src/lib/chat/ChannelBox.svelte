<script lang="ts">
	import { beforeUpdate, afterUpdate, createEventDispatcher } from 'svelte';
	import GameInvit from '$lib/GameInvitBox.svelte';
	import Modal from '$lib/Modal.svelte';
	import { type ConversationType } from 'chat/types';
	import ConversationEntry from './ConversationEntry.svelte';
	import type { CMToServer } from 'chat/constants';

	export let conversation: ConversationType;

	const dispatch = createEventDispatcher<{ msgToChannel: CMToServer }>();
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
			const text = inputElement.value;
			inputElement.value = '';
			if (!text) return;

			dispatch('msgToChannel', {
				channel: conversation.interlocutor,
				content: text
			});
		}
	}
</script>

<div class="chat">
	<div id="title">
		<h2>{conversation.interlocutor}</h2>
	</div>
	<div class="scrollable" bind:this={div}>
		{#each conversation.history as comment}
			<ConversationEntry isMe={comment.isMe} text={comment.text} author={comment.author} />
		{/each}
	</div>

	<input on:keydown={handleKeydown} />
</div>

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
</style>
