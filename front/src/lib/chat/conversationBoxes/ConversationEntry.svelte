<script lang="ts">
	import PendingText from '$lib/PendingText.svelte';
	import { getUser, getUserNow } from '$lib/state';
	import type { ChatMessageDto } from 'backFrontCommon';

	export let message: ChatMessageDto;
	export let type: 'user' | 'channel';
	const sender = getUserNow(message.sender).then((user) => user.name);
</script>

<article class={message.isMe ? 'user' : 'interlocutor'}>
	<span class="conv-entry">{message.content}</span>
	<br />
	{#if type == 'channel' && !message.isMe}
		<PendingText tag="span" text={sender} />
	{/if}
</article>

<style>
	article {
		margin: 0.5em 0;
	}
	span {
		padding: 0.5em 1em;
		display: inline-block;
	}

	.interlocutor {
		text-align: left;
	}

	.interlocutor .conv-entry {
		background-color: #eee;
		border-radius: 1em 1em 1em 0;
	}

	.user {
		text-align: right;
		padding-right: 1em;
	}

	.user .conv-entry {
		background-color: #0074d9;
		color: white;
		border-radius: 1em 1em 0 1em;
		word-break: break-all;
	}
</style>
