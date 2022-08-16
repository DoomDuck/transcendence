<script lang="ts">
	import ConversationListItem from './ConversationListItem.svelte';
	import {
		ChannelConversationList,
		UserConversationList,
		type DisplayableConversation
	} from '../utils';

	export let conversations: UserConversationList | ChannelConversationList;
	const isChannel = conversations instanceof ChannelConversationList;
</script>

<div>
	<!-- {#key conversations} -->
	{#if isChannel}
		{#each conversations.convs as conversation (conversation.displayName)}
			<ConversationListItem {conversation} on:msgToChannel image="group_conv_icon.png" />
		{/each}
	{:else}
		{#each conversations.convs as conversation (conversation.displayName)}
			<ConversationListItem {conversation} hasNewMessage={true} on:msgToUser image="cars.jpeg" />
		{/each}
	{/if}
	<!-- {/key} -->
</div>
