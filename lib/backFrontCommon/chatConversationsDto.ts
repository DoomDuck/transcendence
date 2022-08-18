import type { Id } from "./general";

export type ChatMessageDto = {
  sender: Id;
  content: string;
  isMe: boolean;
}

export type ChatGameInviteMessageDto = {
  sender: Id;
  valid: boolean;
}

export type ActiveUserConversationDto = {
	interlocutor: Id;
	history: ChatMessageDto[];
};

export type ActiveChannelConversationDto = {
	channel: string;
	history: ChatMessageDto[];
};

export type UserHistoryDto = {
  userHistory: ActiveUserConversationDto[],
  channelHistory: ActiveChannelConversationDto[],
}

// export type  FriendDto = {id : number, name : string};
export type  LeaderboardItemDto = {id : number, name : string, victory : number, defeat : number, score : number };
