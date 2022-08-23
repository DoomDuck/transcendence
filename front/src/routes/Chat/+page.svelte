<script lang="ts">
	import { getSocket } from '$lib/ts/login';
	import OnlineFriends from '$lib/chat/OnlineFriends.svelte';
	import ConversationLists from '$lib/chat/ConversationLists.svelte';
	import { ChatEvent, type ChatFeedbackDto, type ChatUserDto } from 'backFrontCommon';
	import type {
		CMFromServer,
		CMToServer,
		CreateChannelToServer,
		DMFromServer,
		DMToServer,
		GameAcceptFromServer,
		GameInviteFromServer,
		GameRefuseFromServer,
		InviteChannelFromServer,
		JoinChannelToServer
	} from 'backFrontCommon/chatEvents';
	import CreateChannelButton from '$lib/chat/buttons/CreateChannelButton.svelte';
	import SendNewMessageButton from '$lib/chat/buttons/SendNewMessageButton.svelte';
	import JoinChannelButton from '$lib/chat/buttons/JoinChannelButton.svelte';
	import { userConvs, channelConvs } from '$lib/ts/utils';
	import { gameInviteMethods } from '$lib/ts/gameInvite';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

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

	// SOCKET SETUP

	getSocket().then((socket) => {
		socket.on(ChatEvent.MSG_TO_USER, receiveDirectMessage);
		socket.on(ChatEvent.MSG_TO_CHANNEL, receiveChannelMessage);
		socket.on(ChatEvent.INVITE_TO_PRIVATE_CHANNEL, receiveInviteChannel);
		socket.on(ChatEvent.GAME_INVITE, receiveGameInvite);
		socket.on(ChatEvent.GAME_ACCEPT, receiveGameAccept);
		socket.on(ChatEvent.GAME_REFUSE, receiveGameRefuse);
	});

	//DEBUG
	onMount(() => {
		receiveGameInvite({ source: 0 });
	});

	// EVENTS FROM SERVER

	function receiveDirectMessage(message: DMFromServer) {
		$userConvs = $userConvs.receiveMessageFromServer(message);
		console.log('received direct message:', JSON.stringify(message));
	}

	function receiveChannelMessage(message: CMFromServer) {
		$channelConvs = $channelConvs.receiveMessageFromServer(message);
		console.log('received channel message:', JSON.stringify(message));
	}

	function receiveInviteChannel(message: InviteChannelFromServer) {
		$channelConvs = $channelConvs.create(message.channel);
	}

	function receiveGameInvite(message: GameInviteFromServer) {
		gameInviteMethods.send(message.source);
	}

	async function receiveGameAccept(message: GameAcceptFromServer) {
		// MAYBE
		await goto('/PlayOnline');
	}

	async function receiveGameRefuse(message: GameRefuseFromServer) {}

	// EVENTS TO SERVER

	async function sendDirectMessage(event: CustomEvent<DMToServer>) {
		console.log('sending DirectMessage:', JSON.stringify(event.detail));
		(await getSocket()).emit(ChatEvent.MSG_TO_USER, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				$userConvs = $userConvs.addMessageFromMe(event.detail.content, event.detail.target);
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}

	async function sendCreateChannel(event: CustomEvent<CreateChannelToServer>) {
		console.log('sending CreateChannel:', JSON.stringify(event.detail));
		(await getSocket()).emit(
			ChatEvent.CREATE_CHANNEL,
			event.detail,
			(feedback: ChatFeedbackDto) => {
				if (feedback.success) {
					$channelConvs = $channelConvs.create(event.detail.channel);
				} else {
					alert(`error: ${feedback.errorMessage}`);
				}
			}
		);
	}

	async function sendChannelMessage(event: CustomEvent<CMToServer>) {
		console.log('sending ChannelMessage:', JSON.stringify(event.detail));
		(await getSocket()).emit(
			ChatEvent.MSG_TO_CHANNEL,
			event.detail,
			(feedback: ChatFeedbackDto) => {
				if (feedback.success) {
					$channelConvs = $channelConvs.addMessageFromMe(
						event.detail.content,
						event.detail.channel
					);
				} else {
					alert(`error: ${feedback.errorMessage}`);
				}
			}
		);
	}

	async function sendJoinChannel(event: CustomEvent<JoinChannelToServer>) {
		console.log('sending JoinChannel:', JSON.stringify(event.detail));
		(await getSocket()).emit(ChatEvent.JOIN_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				$channelConvs = $channelConvs.create(event.detail.channel);
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}
</script>

<div id="chat">
	<div id="title">
		<h1>Chat</h1>
		<div id="options">
			<CreateChannelButton on:createChannel={sendCreateChannel} />
			<JoinChannelButton on:joinChannel={sendJoinChannel} />
			<SendNewMessageButton on:msgToUser={sendDirectMessage} />
		</div>
	</div>

	<div id="mainContainer">
		<input class="champ" type="search" placeholder="Search.." />

		<OnlineFriends {friends} />
		<br />
		<ConversationLists on:msgToUser={sendDirectMessage} on:msgToChannel={sendChannelMessage} />
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
		line-height: 150%;
		-webkit-text-stroke: 2px #00bfff;
		font-size: 2.5em;
	}

	.champ {
		height: 40px;
		width: 80vw;
		font-size: 0.5%;
		color: white;
		background-color: #d9d9d9;
		margin-right: 2%;
		margin-left: 2%;
	}
</style>
