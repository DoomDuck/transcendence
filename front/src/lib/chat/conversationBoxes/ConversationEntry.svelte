<script lang="ts">
	import PendingText from '$lib/PendingText.svelte';
	import UserMiniature from '$lib/UserMiniature.svelte';
	import { users } from '$lib/ts/users';
	import type { ChatMessageDto } from 'backFrontCommon';

	export let message: ChatMessageDto;
	export let type: 'user' | 'channel';
</script>

<article class={message.isMe ? 'user' : 'interlocutor'}>
	{#if type == 'channel' && !message.isMe}
		<PendingText tag="span" text={$users.findOrFetch(message.sender).then((user) => user.name)} />
	{/if}
	<span class="conv-entry">{message.content}</span>
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
