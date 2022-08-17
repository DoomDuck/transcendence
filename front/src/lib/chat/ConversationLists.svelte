<script lang="ts">
	import ConversationListItem from './ConversationListItem.svelte';
	import { users } from '../users';
	import { userConvs, channelConvs } from '$lib/utils';
	import RoundedImage from '$lib/RoundedImage.svelte';
	import ChannelBox from '$lib/chat/ChannelBox.svelte';
	import UserMiniature from '$lib/UserMiniature.svelte';
	import ConversationListItemText from './ConversationListItemText.svelte';
	import ConversationBox from '$lib/chat/ConversationBox.svelte';
</script>

<div>
	{#each $userConvs.convs as conversation (conversation.interlocutor)}
		<!-- <ConversationListItem {conversation} hasNewMessage={true} on:msgToUser image="cars.jpeg" /> -->
		<ConversationListItem on:msgToUser>
			<UserMiniature slot="icon" userPromise={$users.findOrFetch(conversation.interlocutor)} />
			<ConversationListItemText
				slot="item-text"
				text={$users.findOrFetch(conversation.interlocutor).then((user) => user.name)}
			/>
			<ConversationBox slot="conversation-modal" {conversation} />
		</ConversationListItem>
	{/each}
	<br />
	{#each $channelConvs.convs as conversation (conversation.channel)}
		<ConversationListItem on:msgToChannel>
			<RoundedImage slot="icon" imageURL="group_conv_icon.png" />
			<ConversationListItemText slot="item-text" text={conversation.channel} />
			<ChannelBox slot="conversation-modal" {conversation} />
		</ConversationListItem>
	{/each}
	<!-- {/key} -->
</div>
