import type { ConversationType, DirectMessageType } from './types';
import { io, Socket } from 'socket.io-client';
import { ChatEvent } from 'chat/';

export class ChatContext {
	socket: Socket;
	conversations: ConversationType[] = [];
	channels: ConversationType[] = [];

	constructor() {
		this.socket = io('http://localhost:5000/chat', { auth: { token: prompt('your token ?') } });
		this.socket.on(ChatEvent.MSG_TO_USER, this.handleDirectMessage.bind(this));
	}

	private findConversation(interlocutor: string): ConversationType | undefined {
		return this.conversations.find((conversation) => conversation.interlocutor == interlocutor);
	}

	private createConversation(interlocutor: string): ConversationType {
		this.conversations = [{ interlocutor, history: [] }, ...this.conversations];
		return this.conversations[0];
	}

	handleDirectMessage(message: DirectMessageType) {
		const conversation =
			this.findConversation(message.sender) ?? this.createConversation(message.sender);
		conversation.history = [
			...conversation.history,
			{
				author: message.sender,
				text: message.content,
				isMe: false
			}
		];
	}

	sendMessage(interlocutor: string, text: string) {
		this.socket.emit(ChatEvent.MSG_TO_USER, interlocutor, text, (feedback: ChatFeedbackDto) => {
			console.log(`sucess: ${feedback.sucess}`);
			console.log(`errorMessage: ${feedback.errorMessage}`);
		});

		console.log(`interlocutor: ${interlocutor}`);
		console.log(`text: ${text}`);
	}
}

class ChatFeedbackDto {
	constructor(public sucess: boolean, public errorMessage?: string) {}
}
