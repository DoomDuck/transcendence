export type CommentType = {
	author?: string;
	text: string;
	placeholder?: true;
};

export type ConversationType = {
	interlocutor: string;
	comments: CommentType[];
};
