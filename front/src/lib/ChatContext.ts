import type { ConversationEntryType, ConversationType, DirectMessageType } from './types';
import { io, Socket } from 'socket.io-client';

import { ChatEvent, type ChatFeedbackDto } from 'chat/';

export class ChatContext {
	socket: Socket;
	conversations: ConversationType[] = [];
	channels: ConversationType[] = [];

	constructor() {
		this.socket = io('http://localhost:5000/chat', { auth: { token: prompt('your token ?') } });
		this.socket.on(ChatEvent.MSG_TO_USER, this.handleDirectMessage.bind(this));
		this.createConversation('babar');
		this.handleDirectMessage({ sender: 'babar', content: 'hi' });
		this.handleDirectMessage({ sender: 'babar2', content: 'hi' });
	}

	private findConversation(interlocutor: string): ConversationType | undefined {
		return this.conversations.find((conversation) => conversation.interlocutor == interlocutor);
	}

	private createConversation(interlocutor: string): ConversationType {
		this.conversations = [{ interlocutor, history: [] }, ...this.conversations];
		return this.conversations[0];
	}

	private findOrCreateConversation(interlocutor: string) {
		return this.findConversation(interlocutor) ?? this.createConversation(interlocutor);
	}

	private addMessageToConversation(interlocutor: string, message: ConversationEntryType) {
		const conversation = this.findOrCreateConversation(interlocutor);
		conversation.history = [...conversation.history, message];
	}

	handleDirectMessage(message: DirectMessageType) {
		this.addMessageToConversation(message.sender, {
			author: message.sender,
			isMe: false,
			text: message.content
		});
	}

	sendDirectMessage(interlocutor: string, text: string) {
		this.socket.emit(
			ChatEvent.MSG_TO_USER,
			{
				target: interlocutor,
				text: text
			},
			(feedback: ChatFeedbackDto) => {
				if (feedback.success) {
					this.addMessageToConversation(interlocutor, {
						author: '',
						isMe: true,
						text: text
					});
				} else {
					alert(`error: ${feedback.errorMessage}`);
				}
			}
		);
		console.log(`interlocutor: ${interlocutor}`);
		console.log(`text: ${text}`);
	}
}
