<script lang="ts">
	import { onMount } from 'svelte';
	import ConversationListItem from './ConversationListItem.svelte';
	import { ChatContext } from '$lib/ChatContext';
	import { type ConversationType } from './types';

	export let context: ChatContext;
	let userHistoryDto;
	let error = false;
</script>

<div>
	{#key context.conversations}
		{#each context.conversations as conversation}
			<ConversationListItem {conversation} on:msgToUser image="cars.jpeg" />
		{/each}
	{/key}
</div>
