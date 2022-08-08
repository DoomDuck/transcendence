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
	sender: string;
	content: string;
};
