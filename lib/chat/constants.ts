export class ChatEvent {
	static readonly MSG_TO_CHANNEL ="msg to channel"
	static readonly MSG_TO_USER ='msg to user'
	static readonly JOIN_CHANNEL ='join channel'
	static readonly CREATE_CHANNEL ='create channel'
	static readonly GAME_INVITE ='game invite'
	static readonly FRIEND_INVITE ='friend invite'
}

export class ChatError {
	 static readonly U_DO_NOT_EXIST ="u do not exist"
	 static readonly USER_NOT_FOUND ="user not found"
	 static readonly USER_OFFLINE ="user offline"
	 static readonly CHANNEL_NOT_FOUND ="channel not found"
	 static readonly WRONG_PASSWORD ="wrong password"
	 static readonly YOU_ARE_BANNED ="you are banned"
	 static readonly YOU_ARE_MUTED ="you are muted"
	 static readonly YOU_ARE_BLOCKED ="you are blocked"
	static readonly ALREADY_FRIEND = "already friend";
	static readonly ALREADY_IN_CHANNEL = "already in channel";
}
