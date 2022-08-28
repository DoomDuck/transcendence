import {
	type ActiveChannelConversationDto,
	type ActiveUserConversationDto,
	type ChatMessageDto,
	type UserHistoryDto,
	type UserInfo
} from 'backFrontCommon';
import { writable } from 'svelte/store';
import {
	ChatEvent,
	type CMFromServer,
	type DMFromServer,
	type RequestFeedbackDto
} from 'backFrontCommon/chatEvents';
import { usersObject } from './users';
import type { Id, TypeMap } from 'backFrontCommon/general';
import { state } from './state';

// type ChatMessageGameInvit = {
// 	source: Id;
// 	valid: boolean;
// };

// type ChatMessageEntry = TypeMap<{ message: ChatMessageDto; gameInvite: ChatMessageGameInvit }>;

// export class ConversationHistory {
// 	private history: ChatMessageEntry[] = [];

// 	addMessage(message: ChatMessageDto) {
// 		this.history.push({ key: 'message', payload: message });
// 	}
// 	addGameInvite(gameInvite: ChatMessageGameInvit) {
// 		this.history.push({ key: 'gameInvite', payload: gameInvite });
// 	}
// }

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

export function getChatHistory() {
	state.socket.emit(ChatEvent.GET_CHAT_HISTORY, (feedback: RequestFeedbackDto<UserHistoryDto>) => {
		if (!feedback.success) {
			alert(feedback.errorMessage);
			return;
		}
		const history = feedback.result!;
		userConvs.update((userConversationList) => {
			userConversationList.convs = [];
			history.userHistory.forEach((convDto) => {
				const conv = new UserConversation(convDto.interlocutor);
				for (const message of convDto.history) {
					conv.addMessage(message);
				}
				userConversationList.convs.push(conv);
			});
			return userConversationList;
		});

		channelConvs.update((channelConversationList) => {
			channelConversationList.convs = [];
			history.channelHistory.forEach((convDto) => {
				const conv = new ChannelConversation(convDto.channel);
				for (const message of convDto.history) {
					conv.addMessage(message);
				}
				channelConversationList.convs.push(conv);
			});
			return channelConversationList;
		});
	});
}

// export function feedbackCallback(action: () => void) {
//   return (feedback: ChatFeedbackDto) => {
//     if (feedback.success)
//       action();
//     else
//       alert(feedback.errorMessage);
//   }
// }
