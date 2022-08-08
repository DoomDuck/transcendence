<script lang="ts">
	import { onMount } from 'svelte';
	import ConversationListItem from './ConversationListItem.svelte';
	import { ChatContext } from '$lib/ChatContext';
	import { type ConversationType } from './types';

	export let context: ChatContext;
	let userHistoryDto;
	let error = false;

	// onMount(async () => {
	// 	const resp = await fetch('http://localhost:5000/history/0', { method: 'GET' });

	// 	if (resp.ok) {
	// 		userHistoryDto = await resp.json();
	// 		conversations = [...userHistoryDto.userHistory, ...userHistoryDto.channelHistory];
	// 		console.log('OK');
	// 	} else {
	// 		error = true;
	// 		console.log('PAS OK');
	// 		console.log(resp.status);
	// 		console.log(resp.statusText);
	// 	}
	// });
</script>

<div>
	{#each context.conversations as conversation}
		<ConversationListItem {conversation} image="cars.jpeg" />
	{:else}
		<p>Waiting...</p>
	{/each}
</div>
