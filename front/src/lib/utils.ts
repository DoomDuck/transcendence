import {
	ChatError,
	type ActiveChannelConversationDto,
	type ActiveUserConversationDto,
	type ChatMessageDto,
	type ChatUserDto
} from 'backFrontCommon';
import { readable, writable } from 'svelte/store';
import { FrontChatError } from './errors';

type Id = number;

export class Users {
	private map: Map<Id, ChatUserDto> = new Map();
	constructor() {}

	async findOrFetch(id: number): Promise<ChatUserDto> {
		if (this.map.has(id)) return this.map.get(id) as ChatUserDto;
		const user = await fetchUser(id);
		this.map.set(id, user);
		return user;
	}
}

async function fetchUser(id: number): Promise<ChatUserDto> {
	const response = await fetch(`http://localhost:5000/user/${id}`, { method: 'GET' });
	const result = await response.json();
	console.log(JSON.stringify(response));
	return result;
}

export const users = readable(new Users());

export interface DisplayableConversation {
	displayName: string;
	history: ChatMessageDto[];
}

export class UserConversation implements DisplayableConversation {
	dto: ActiveUserConversationDto;
	constructor(interlocutor: Id) {
		this.dto = {
			interlocutor,
			history: []
		};
	}
	get displayName(): string {
		return `${this.dto.interlocutor}`; // to change with users store
	}
	get history(): ChatMessageDto[] {
		return this.dto.history;
	}
}

export class ChannelConversation implements DisplayableConversation {
	dto: ActiveChannelConversationDto;
	constructor(channel: string) {
		this.dto = {
			channel,
			history: []
		};
	}
	get displayName(): string {
		return this.dto.channel;
	}
	get history(): ChatMessageDto[] {
		return this.dto.history;
	}
}

export class UserConversationList {
	convs: UserConversation[] = [];

	addMessage(message: ChatMessageDto, interlocutor?: Id): UserConversationList {
		const convInterlocutor = interlocutor ?? message.sender;
		let conv = this.convs.find((conv) => conv.dto.interlocutor == convInterlocutor);
		if (conv == undefined) conv = new UserConversation(message.sender);
		conv.dto.history.push(message);
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
		if (conv == undefined) conv = new ChannelConversation(channel);
		conv.dto.history.push(message);
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

export const tokenKey = Symbol();
export const socketKey = Symbol();
