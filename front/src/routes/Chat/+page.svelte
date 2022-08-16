<script lang="ts">
	import OnlineFriends from '$lib/chat/OnlineFriends.svelte';
	import CreateChannel from '$lib/chat/CreateChannel.svelte';
	import ConversationList from '$lib/chat/ConversationList.svelte';
	import { io, Socket as IOSocketBaseType } from 'socket.io-client';
	import {
		type ServerToClientEvents,
		type ClientToServerEvents,
		ChatEvent,
		type ChatFeedbackDto
	} from 'backFrontCommon';
	import type {
		CMFromServer,
		CMToServer,
		CreateChannelToServer,
		DMFromServer,
		DMToServer,
		JoinChannelToServer
	} from 'backFrontCommon/chatEvents';
	import SendNewMessage from '$lib/chat/SendNewMessage.svelte';
	import JoinChannel from '$lib/chat/JoinChannel.svelte';
	import type {
		ChatMessageDto,
		ActiveUserConversationDto,
		ActiveChannelConversationDto,
		UserHistoryDto
	} from 'backFrontCommon';
	import { users, userConvs, channelConvs, socketKey } from '$lib/utils';
	import { getContext } from 'svelte';

	type Socket = IOSocketBaseType<ServerToClientEvents, ClientToServerEvents>;
	let friends = [
		{ image: 'cars.jpeg', name: 'castor' },
		{ image: 'canard.jpeg', name: 'fourmi' }
	];

	// let directConvs: ActiveUserConversationDto[] = [
	// 	{
	// 		interlocutor: 0, // 'Maman'
	// 		history: [
	// 			{
	//         sender: 0,
	// 				isMe: false,
	// 				content: 'salut'
	// 			}
	// 		]
	// 	}
	// ];
	// // userConvs.update()

	// let chanConvs: ActiveChannelConversationDto[] = [
	// 	{
	// 		channel: 'Un groupe de gens',
	// 		history: [
	// 			{
	// 				sender: -1,
	// 				isMe: true,
	// 				content: 'Salut,\nJe crée un groupe'
	// 			},
	// 			{
	// 				sender: 1, //'Victor'
	// 				isMe: false,
	// 				content: 'Pas intéressé'
	// 			},
	// 			{
	// 				sender: 2, // 'Jean'
	// 				isMe: false,
	// 				content: 'Moi non plus'
	// 			}
	// 		]
	// 	}
	// ];

	// INITIALISATION

	const socket: Socket = getContext(socketKey);

	socket.on(ChatEvent.MSG_TO_USER, receiveDirectMessage);
	socket.on(ChatEvent.MSG_TO_CHANNEL, receiveChannelMessage);
	// EVENTS FROM SERVER

	function receiveDirectMessage(message: DMFromServer) {
		console.log('received direct message:', JSON.stringify(message));
	}

	function receiveChannelMessage(message: CMFromServer) {
		console.log('received channel message:', JSON.stringify(message));
	}

	// EVENTS TO SERVER

	function sendDirectMessage(event: CustomEvent<DMToServer>) {
		socket.emit(ChatEvent.MSG_TO_USER, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				// directConvs = addMyMessageToConversation(
				// 	directConvs,
				// 	event.detail.target,
				// 	event.detail.content
				// );
				// userConvs.update(() => $userConvs)
				$userConvs = $userConvs.addMessageFromMe(event.detail.content, event.detail.target);
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}

	function sendCreateChannel(event: CustomEvent<CreateChannelToServer>) {
		console.log('sending CreateChannel:', JSON.stringify(event.detail));
		socket.emit(ChatEvent.CREATE_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				// createChannel(event.detail.channel);
				$channelConvs = $channelConvs.create(event.detail.channel);
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}

	function sendChannelMessage(event: CustomEvent<CMToServer>) {
		console.log('sending ChannelMessage:', JSON.stringify(event.detail));
		socket.emit(ChatEvent.MSG_TO_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				$channelConvs = $channelConvs.addMessageFromMe(event.detail.content, event.detail.channel);
				// chanConvs = addMyMessageToConversation(
				// 	chanConvs,
				// 	event.detail.channel,
				// 	event.detail.content
				// );
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}

	function sendJoinChannel(event: CustomEvent<JoinChannelToServer>) {
		console.log('sending JoinChannel:', JSON.stringify(event.detail));
		socket.emit(ChatEvent.JOIN_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
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
			<CreateChannel on:createChannel={sendCreateChannel} />
			<JoinChannel on:joinChannel={sendJoinChannel} />
			<SendNewMessage on:msgToUser={sendDirectMessage} />
		</div>
	</div>

	<div id="mainContainer">
		<input class="champ" type="search" placeholder="Search.." />

		<OnlineFriends onlineFriends={friends} />
		<ConversationList conversations={$userConvs} on:msgToUser={sendDirectMessage} />
		<br />
		<ConversationList conversations={$channelConvs} on:msgToChannel={sendChannelMessage} />
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
