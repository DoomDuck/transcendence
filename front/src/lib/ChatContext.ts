import type { ConversationType, DirectMessageType } from './types';
import { io, Socket } from 'socket.io-client';

export class ChatContext {
	// socket: Socket;
	conversations: ConversationType[] = [];
	channels: ConversationType[] = [];

	constructor() {
		this.socket = io('http://localhost:5000/chat');
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
}
