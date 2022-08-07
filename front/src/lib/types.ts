export type CommentType = {
	author: string;
	text: string;
	isMe: boolean;
	placeholder?: true;
};

export type ConversationType = {
	interlocutor: string;
	comments: CommentType[];
};
