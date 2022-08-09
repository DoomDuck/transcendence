<script lang="ts">
	import { onMount } from 'svelte';
	import ConversationListItem from './ConversationListItem.svelte';
	import { type ConversationType } from './types';
	import ConversationBox from './ConversationBox.svelte';

	export let conversations: ConversationType[];
	let userHistoryDto;
	let error = false;
</script>

<div>
	<!-- {#key conversations} -->
	{#each conversations as conversation (conversation.interlocutor)}
		<ConversationListItem {conversation} on:msgToUser image="cars.jpeg" />
	{/each}
	<!-- {/key} -->
</div>
