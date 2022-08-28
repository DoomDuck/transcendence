<script lang="ts">
	import OnlineFriends from '$lib/chat/OnlineFriends.svelte';
	import ConversationLists from '$lib/chat/ConversationLists.svelte';
	import CreateChannelButton from '$lib/chat/buttons/CreateChannelButton.svelte';
	import SendNewMessageButton from '$lib/chat/buttons/SendNewMessageButton.svelte';
	import JoinChannelButton from '$lib/chat/buttons/JoinChannelButton.svelte';
	import { userConvs, channelConvs } from '$lib/ts/chatUtils';

	// VALUES FOR THE DEBUG OF THE DISPLAY

	let friends = [0, 1];

	$userConvs.addMessage({
		sender: 0,
		isMe: false,
		content: 'salut'
	});
	$channelConvs.addMessage(
		{
			sender: -1,
			isMe: true,
			content: 'Salut,\nJe crée un groupe'
		},
		'Un groupe de gens'
	);
	$channelConvs.addMessage(
		{
			sender: 1,
			isMe: false,
			content: 'Pas intéressé'
		},
		'Un groupe de gens'
	);
	$channelConvs.addMessage(
		{
			sender: 2,
			isMe: false,
			content: 'Moi non plus'
		},
		'Un groupe de gens'
	);
</script>

<div id="chat">
	<div id="title">
		<h1>Chat</h1>
		<div id="options">
			<CreateChannelButton />
			<JoinChannelButton />
			<SendNewMessageButton />
		</div>
	</div>

	<div id="mainContainer">

		<OnlineFriends {friends} />
		<br />
		<ConversationLists />
	</div>
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}

	#chat {
		width: 100%;
		height: 100%;
		background-image: url('/starsSky.png');
		background-size: cover;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		overflow-y: scroll;
	}

	#title {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-left: 10vw;
		margin-right: 10vw;
	}

	#options {
		display: flex;
		flex-direction: row;
		align-items: center;
		gap: 20px;
	}

	#mainContainer {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}

	h1 {
		justify-content: left;
		font-style: normal;
		color: #fa1ec7;
		line-height: 300%;
		-webkit-text-stroke: 2px #00bfff;
		font-size: 3em;
	}

</style>
