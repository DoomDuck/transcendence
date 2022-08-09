<script lang="ts">
	import OnlineFriends from '$lib/OnlineFriends.svelte';
	import WriteNewMsg from '$lib/WriteNewMsg.svelte';
	import CreateChannel from '$lib/CreateChannel.svelte';
	import ConversationList from '$lib/ConversationList.svelte';
	import type { ChannelConvType, ConversationEntryType, ConversationType } from '$lib/types';
	import { io, Socket as IOSocketBaseType } from 'socket.io-client';
	import {
		type ServerToClientEvents,
		type ClientToServerEvents,
		ChatEvent,
		type ChatFeedbackDto
	} from 'chat';
	import type { CreateChannelToServer, DMFromServer } from 'chat/constants';

	type Socket = IOSocketBaseType<ServerToClientEvents, ClientToServerEvents>;
	let friends = [
		{ profilePic: 'cars.jpeg', name: 'coullax' },
		{ profilePic: 'canard.jpeg', name: 'coullax' }
	];

	let conversations: ConversationType[] = [];
	let channels: ChannelConvType[] = [];

	const socket: Socket = io('http://localhost:5000/chat', {
		auth: { token: prompt('your token ?') }
	});

	socket.on(ChatEvent.MSG_TO_USER, handleDirectMessage);

	function findConversation(interlocutor: string): number | undefined {
		const i = conversations.findIndex((conversation) => conversation.interlocutor == interlocutor);
		if (i == -1) return undefined;
		return i;
	}

	function createConversation(interlocutor: string): number {
		conversations = [{ interlocutor, history: [] }, ...conversations];
		return 0;
	}

	function findOrCreateConversation(interlocutor: string): number {
		return findConversation(interlocutor) ?? createConversation(interlocutor);
	}

	function addMessageToConversation(interlocutor: string, message: ConversationEntryType) {
		const i = findOrCreateConversation(interlocutor);
		const conversation = conversations[i];
		conversation.history = [...conversation.history, message];
		conversations.splice(i, 1);
		conversations = [conversation, ...conversations];
	}

	function handleDirectMessage(message: DMFromServer) {
		addMessageToConversation(message.source, {
			author: message.source,
			isMe: false,
			text: message.content
		});
		console.log(JSON.stringify(message));
		console.log(JSON.stringify(conversations));
	}

	function handleMsgToUser(event: CustomEvent) {
		sendDirectMessage(event.detail.interlocutor, event.detail.text);
	}

	function sendDirectMessage(interlocutor: string, text: string) {
		socket.emit(
			ChatEvent.MSG_TO_USER,
			{
				target: interlocutor,
				content: text
			},
			(feedback: ChatFeedbackDto) => {
				if (feedback.success) {
					addMessageToConversation(interlocutor, {
						author: '',
						isMe: true,
						text: text
					});
				} else {
					alert(`error: ${feedback.errorMessage}`);
				}
			}
		);
	}

	function createChannel(channelName: string): number {
		channels = [{ channelName, history: [] }, ...channels];
		return 0;
	}

	function handleCreateChannel(event: CustomEvent<CreateChannelToServer>) {
		console.log(JSON.stringify(event.detail));
		socket.emit(ChatEvent.CREATE_CHANNEL, event.detail, (feedback: ChatFeedbackDto) => {
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
			<CreateChannel on:createChannel={handleCreateChannel} />
			<WriteNewMsg on:msgToUser={handleMsgToUser} />
		</div>
	</div>

	<div id="mainContainer">
		<input class="champ" type="search" placeholder="Search.." />

		<OnlineFriends onlineFriends={friends} />
		<ConversationList {conversations} on:msgToUser={handleMsgToUser} />
	</div>
</div>

<style>
	* {
		font-family: 'Press Start 2P';
	}

	#chat {
		width: 100%;
		height: 100%;
		background-image: url('/starsSky.jpeg');
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
