import {
	type ActiveChannelConversationDto,
	type ActiveUserConversationDto,
	type ChatMessageDto,
	type UserInfo
} from 'backFrontCommon';
import { writable } from 'svelte/store';
import type { CMFromServer, DMFromServer } from 'backFrontCommon/chatEvents';
import type { Id, TypeMap } from 'backFrontCommon/general';
import { getUser } from '$lib/state';

type ChatMessageGameInvit = {
	source: Id;
	valid: boolean;
};

type ChatMessageEntry = TypeMap<{ message: ChatMessageDto; gameInvite: ChatMessageGameInvit }>;

export class ConversationHistory {
	private history: ChatMessageEntry[] = [];

	addMessage(message: ChatMessageDto) {
		this.history.push({ key: 'message', payload: message });
	}
	addGameInvite(gameInvite: ChatMessageGameInvit) {
		this.history.push({ key: 'gameInvite', payload: gameInvite });
	}
}

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
	async getInterlocuterAsDto(): Promise<UserInfo> {
		return getUser(this.interlocutor);
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

// export function feedbackCallback(action: () => void) {
//   return (feedback: ChatFeedbackDto) => {
//     if (feedback.success)
//       action();
//     else
//       alert(feedback.errorMessage);
//   }
// }
