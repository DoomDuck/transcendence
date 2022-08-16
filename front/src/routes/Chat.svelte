<script lang="ts">
	import OnlineFriends from '$lib/chat/OnlineFriends.svelte';
	import CreateChannel from '$lib/chat/CreateChannel.svelte';
	import ConversationList from '$lib/chat/ConversationList.svelte';
	import { io, Socket as IOSocketBaseType } from 'socket.io-client';
	import {
		type ServerToClientEvents,
		type ClientToServerEvents,
		ChatEvent,
		type ChatFeedbackDto,
		type ChatUserType
	} from 'chat';
	import type {
		CMFromServer,
		CMToServer,
		CreateChannelToServer,
		DMFromServer,
		DMToServer,
		JoinChannelToServer
	} from 'chat/constants';
	import SendNewMessage from '$lib/chat/SendNewMessage.svelte';
	import JoinChannel from '$lib/chat/JoinChannel.svelte';
	import type { ConversationEntryType, ConversationType } from 'chat/types';
	import { users } from '$lib/utils';

	type Socket = IOSocketBaseType<ServerToClientEvents, ClientToServerEvents>;
	let friends = [
		{ image: 'cars.jpeg', name: 'castor' },
		{ image: 'canard.jpeg', name: 'fourmi' }
	];

	let directConvs: ConversationType[] = [
		{
			interlocutor: 'maman',
			history: [
				{
					author: 'maman',
					isMe: false,
					text: 'salut'
				}
			]
		}
	];

	let chanConvs: ConversationType[] = [
		{
			interlocutor: 'Un groupe de gens',
			history: [
				{
					author: 'me',
					isMe: true,
					text: 'Salut,\nJe crée un groupe'
				},
				{
					author: 'Victor',
					isMe: false,
					text: 'Pas intéressé'
				},
				{
					author: 'Jean',
					isMe: false,
					text: 'Moi non plus'
				}
			]
		}
	];

	// INITIALISATION

	let id_str: string | undefined;
	do {
		id_str = prompt('your token ?')?.trim();
	} while (
		!(id_str !== undefined && id_str.length > 0 && Number.isInteger(+id_str) && +id_str >= 0)
	);
	const socket: Socket = io('http://localhost:5000/chat', {
		auth: { token: id_str }
	});
	const id = +id_str;

	socket.on(ChatEvent.MSG_TO_USER, receiveDirectMessage);
	socket.on(ChatEvent.MSG_TO_CHANNEL, receiveChannelMessage);

	// UTILS

	function addMessageToConversation(
		convs: ConversationType[],
		interlocutor: string,
		message: ConversationEntryType
	): ConversationType[] {
		const i = convs.findIndex((conv) => conv.interlocutor == interlocutor);
		let conv: ConversationType;
		if (i == -1) conv = { interlocutor, history: [] };
		else {
			conv = convs[i];
			convs.splice(i, 1);
		}
		conv.history = [...conv.history, message];
		return [conv, ...convs];
	}

	function addMyMessageToConversation(
		convs: ConversationType[],
		interlocutor: string,
		content: string
	): ConversationType[] {
		return addMessageToConversation(convs, interlocutor, {
			author: '',
			isMe: true,
			text: content
		});
	}

	function createChannel(channelName: string): number {
		chanConvs = [{ interlocutor: channelName, history: [] }, ...chanConvs];
		return 0;
	}

	// EVENTS FROM SERVER

	function receiveDirectMessage(message: DMFromServer) {
		directConvs = addMessageToConversation(directConvs, message.source, {
			author: message.source,
			isMe: false,
			text: message.content
		});
		console.log('received direct message:', JSON.stringify(message));
	}

	function receiveChannelMessage(message: CMFromServer) {
		chanConvs = addMessageToConversation(chanConvs, message.channel, {
			author: message.source,
			isMe: false,
			text: message.content
		});
		console.log('received channel message:', JSON.stringify(message));
	}

	// EVENTS TO SERVER

	function sendDirectMessage(event: CustomEvent<DMToServer>) {
		socket.emit(ChatEvent.MSG_TO_USER, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				directConvs = addMyMessageToConversation(
					directConvs,
					event.detail.target,
					event.detail.content
				);
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}

	function sendCreateChannel(event: CustomEvent<CreateChannelToServer>) {
		console.log('sending CreateChannel:', JSON.stringify(event.detail));
		socket.emit(ChatEvent.CREATE_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				createChannel(event.detail.channel);
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}

	function sendChannelMessage(event: CustomEvent<CMToServer>) {
		console.log('sending ChannelMessage:', JSON.stringify(event.detail));
		socket.emit(ChatEvent.MSG_TO_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				chanConvs = addMyMessageToConversation(
					chanConvs,
					event.detail.channel,
					event.detail.content
				);
			} else {
				alert(`error: ${feedback.errorMessage}`);
			}
		});
	}

	function sendJoinChannel(event: CustomEvent<JoinChannelToServer>) {
		console.log('sending JoinChannel:', JSON.stringify(event.detail));
		socket.emit(ChatEvent.JOIN_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
			if (feedback.success) {
				createChannel(event.detail.channel);
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
		<ConversationList
			conversations={directConvs}
			isChannel={false}
			on:msgToUser={sendDirectMessage}
		/>
		<br />
		<ConversationList
			conversations={chanConvs}
			isChannel={true}
			on:msgToChannel={sendChannelMessage}
		/>
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
