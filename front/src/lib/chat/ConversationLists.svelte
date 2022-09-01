<script lang="ts">
	import ConversationListItem from './ConversationListItem.svelte';
	import { getUser, storeMap } from '$lib/state';
	import { userConvs, channelConvs } from '$lib/ts/chatUtils';
	import ChannelBox from '$lib/chat/conversationBoxes/ChannelConvBox.svelte';
	import UserMiniature from '$lib/UserMiniature.svelte';
	import ConversationListItemText from './ConversationListItemText.svelte';
	import ConversationBox from './conversationBoxes/UserConvBox.svelte';
	import ChannelMiniature from '$lib/ChannelMiniature.svelte';
	import DeStore from '$lib/DeStore.svelte';
</script>

<div>
	{#each $userConvs.convs as conversation (conversation.interlocutor)}
		<ConversationListItem bind:hasNewMessage={conversation.hasNewMessage}>
			<UserMiniature slot="icon" userId={conversation.interlocutor} />
			<DeStore component={ConversationListItemText}
				slot="item-text"
				text={storeMap(getUser(conversation.interlocutor), (user) => user.name)}
			/>
			<ConversationBox slot="conversation-modal" {conversation} />
		</ConversationListItem>
	{/each}
	<br />
	{#each $channelConvs.convs as conversation (conversation.channel)}
		<ConversationListItem bind:hasNewMessage={conversation.hasNewMessage}>
			<ChannelMiniature channel={conversation.channel} slot="icon" />
			<!-- <AvatarIcon type={'channel'} slot="icon" imageURL="group_conv_icon.png" /> -->
			<ConversationListItemText slot="item-text" text={conversation.channel} />
			<ChannelBox slot="conversation-modal" {conversation} />
		</ConversationListItem>
	{/each}
</div>
