import type {
	ActiveChannelConversationDto,
	ActiveUserConversationDto,
	ChatMessageDto,
	ChatUserDto
} from 'backFrontCommon';
import { readable, writable } from 'svelte/store';

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

export class UserConversation {
	dto: ActiveUserConversationDto;
	constructor(interlocutor: Id) {
		this.dto = {
			interlocutor,
			history: []
		};
	}
}

export class ChannelConversation {
	dto: ActiveChannelConversationDto;
	constructor(channel: string) {
		this.dto = {
			channel,
			history: []
		};
	}
}

// export class UserConversationList {
//   convs: UserConversation[] = [];

//   addMessage(message: ChatMessageDto):  {
//     let conv = this.convs.find((conv) => conv.dto.interlocutor == message.sender);
// 		if (conv == undefined)
//       conv = new UserConversation(message.sender);
// 		conv.dto.history.push(message);
//   }
// }

// export class ChannelConversationList {
//   convs: ChannelConversation[] = [];

//   addMessage(channel: string, message: ChatMessageDto):  {
//     let conv = this.convs.find((conv) => conv.dto.channel == channel);
// 		if (conv == undefined)
//       conv = new ChannelConversation(channel);
// 		conv.dto.history.push(message);
//   }
// }

// export const userConvs = writable(new UserConversationList());
// export const channelConvs = writable(new ChannelConversationList());

export type ConversationType = {
	interlocutor: string;
	history: DirectMessageType[];
};
export type DirectMessageType = {
	author: string;
	isMe: boolean;
	text: string;
};
