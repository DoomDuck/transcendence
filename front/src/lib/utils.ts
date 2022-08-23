import {
	type ActiveChannelConversationDto,
	type ActiveUserConversationDto,
	type ChatMessageDto,
	type ChatUserDto
} from 'backFrontCommon';
import { writable } from 'svelte/store';

import { Socket as IOSocketBaseType } from 'socket.io-client';
import { type ServerToClientEvents, type ClientToServerEvents } from 'backFrontCommon';
import type { CMFromServer, DMFromServer } from 'backFrontCommon/chatEvents';
import { usersObject } from './users';

export type ChatSocket = IOSocketBaseType<ServerToClientEvents, ClientToServerEvents>;

type Id = number;

export abstract class Conversation<DTOType extends { history: ChatMessageDto[] }> {
	hasNewMessage: boolean = false;
	constructor(public dto: DTOType) {}

	get history(): ChatMessageDto[] {
		return this.dto.history;
	}
	addMessage(message: ChatMessageDto) {
		this.history.push(message);
		if (!message.isMe) this.hasNewMessage = true;
	}
}

export class UserConversation extends Conversation<ActiveUserConversationDto> {
	constructor(interlocutor: Id) {
		super({
			interlocutor,
			history: []
		});
	}
	get interlocutor(): Id {
		return this.dto.interlocutor;
	}
	async getInterlocuterAsDto(): Promise<ChatUserDto> {
		return usersObject.findOrFetch(this.interlocutor);
	}
}

export class ChannelConversation extends Conversation<ActiveChannelConversationDto> {
	constructor(channel: string) {
		super({
			channel,
			history: []
		});
	}
	get channel(): string {
		return this.dto.channel;
	}
}

export class UserConversationList {
	convs: UserConversation[] = [];

	addMessage(message: ChatMessageDto, interlocutor?: Id): UserConversationList {
		const convInterlocutor = interlocutor ?? message.sender;
		let conv = this.convs.find((conv) => conv.dto.interlocutor == convInterlocutor);
		if (conv == undefined) {
			conv = new UserConversation(convInterlocutor);
			this.convs.push(conv);
		}
		conv.addMessage(message);
		// conv.dto.history.push(message);
		return this;
	}

	receiveMessageFromServer(message: DMFromServer): UserConversationList {
		this.addMessage({
			sender: message.source,
			content: message.content,
			isMe: false
		});
		return this;
	}

	addMessageFromMe(content: string, interlocutor: number): UserConversationList {
		this.addMessage(messageFromMe(content), interlocutor);
		return this;
	}
}

export class ChannelConversationList {
	convs: ChannelConversation[] = [];

	addMessage(message: ChatMessageDto, channel: string): ChannelConversationList {
		let conv = this.convs.find((conv) => conv.dto.channel == channel);
		if (conv == undefined) {
			conv = new ChannelConversation(channel);
			this.convs.push(conv);
		}
		conv.addMessage(message);
		// conv.dto.history.push(message);
		return this;
	}

	receiveMessageFromServer(message: CMFromServer): ChannelConversationList {
		this.addMessage(
			{
				sender: message.source,
				content: message.content,
				isMe: false
			},
			message.channel
		);
		return this;
	}

	addMessageFromMe(content: string, channel: string): ChannelConversationList {
		this.addMessage(messageFromMe(content), channel);
		return this;
	}

	create(channel: string): ChannelConversationList {
		if (this.convs.find((conv) => conv.dto.channel == channel) == undefined) {
			this.convs.push(new ChannelConversation(channel));
		}
		return this;
	}
}

function messageFromMe(content: string): ChatMessageDto {
	return {
		sender: -1,
		isMe: true,
		content
	};
}

export const userConvs = writable(new UserConversationList());
export const channelConvs = writable(new ChannelConversationList());

export const chatContextKey = Symbol();
export type ChatContext = {
	token: string;
	socket: ChatSocket;
};

export function isPositiveInteger(s: string) {
	return s.length > 0 && Number.isInteger(+s) && +s >= 0;
}
