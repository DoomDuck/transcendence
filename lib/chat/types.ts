export type UserType = {
  id: number,
  name: string,
  image: string,
  profile: ProfileType
}

export type ProfileType = {
  classement: number,
  matchHistory: MatchOutcomeType[],
}

export type MatchOutcomeType = {
  opponent: number,
  winner: boolean
}

export type ConversationEntryType = {
	author: string;
	text: string;
	isMe: boolean;
	placeholder?: true;
};

export type ConversationType = {
	interlocutor: string;
	history: ConversationEntryType[];
};

export type DirectMessageType = {
	interlocutor: string;
	content: string;
};
