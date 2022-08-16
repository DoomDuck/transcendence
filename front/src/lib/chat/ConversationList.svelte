<script lang="ts">
	import ConversationListItem from './ConversationListItem.svelte';
	import { type ConversationType } from '../utils';

	export let conversations: ConversationType[];
	export let isChannel: boolean;
</script>

<div>
	<!-- {#key conversations} -->
	{#if isChannel}
		{#each conversations as conversation (conversation.interlocutor)}
			<ConversationListItem
				{conversation}
				isChannel={true}
				on:msgToChannel
				image="group_conv_icon.png"
			/>
		{/each}
	{:else}
		{#each conversations as conversation (conversation.interlocutor)}
			<ConversationListItem {conversation} isChannel={false} on:msgToUser image="cars.jpeg" />
		{/each}
	{/if}
	<!-- {/key} -->
</div>
