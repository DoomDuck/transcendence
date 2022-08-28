<script lang="ts">
	import ConversationListItem from './ConversationListItem.svelte';
	import { getUser } from '$lib/state';
	import { userConvs, channelConvs } from '$lib/ts/chatUtils';
	import AvatarIcon from '$lib/AvatarIcon.svelte';
	import ChannelBox from '$lib/chat/conversationBoxes/ChannelConvBox.svelte';
	import UserMiniature from '$lib/UserMiniature.svelte';
	import ConversationListItemText from './ConversationListItemText.svelte';
	import ConversationBox from './conversationBoxes/UserConvBox.svelte';
</script>

<div>
	{#each $userConvs.convs as conversation (conversation.interlocutor)}
		<ConversationListItem bind:hasNewMessage={conversation.hasNewMessage}>
			<UserMiniature slot="icon" userId={conversation.interlocutor} />
			<ConversationListItemText
				slot="item-text"
				text={getUser(conversation.interlocutor).then((user) => user.name)}
			/>
			<ConversationBox slot="conversation-modal" {conversation} />
		</ConversationListItem>
	{/each}
	<br />
	{#each $channelConvs.convs as conversation (conversation.channel)}
		<ConversationListItem bind:hasNewMessage={conversation.hasNewMessage}>
			<AvatarIcon type={'channel'} slot="icon" imageURL="group_conv_icon.png" />
			<ConversationListItemText slot="item-text" text={conversation.channel} />
			<ChannelBox slot="conversation-modal" {conversation} />
		</ConversationListItem>
	{/each}
</div>
