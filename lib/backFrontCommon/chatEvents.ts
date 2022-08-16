import type { Id } from "./general"

export class ChatEvent {
	static readonly MSG_TO_CHANNEL = "msg to channel"
	static readonly MSG_TO_USER = 'msg to user'
	static readonly JOIN_CHANNEL = 'join channel'
	static readonly CREATE_CHANNEL = 'create channel'
	static readonly INVITE_TO_PRIVATE_CHANNEL = 'invite to channel'
	static readonly GAME_INVITE = 'game invite'
	static readonly FRIEND_INVITE = 'friend invite'
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
  static readonly NOT_IN_CHANNEL ="not in channel"
	static readonly ALREADY_FRIEND = "already friend";
	static readonly ALREADY_IN_CHANNEL = "already in channel";
	static readonly ALREADY_ADMIN = "already admin";
	static readonly NAME_ALREADY_IN_USE = "name already in use";
	static readonly CHANNEL_IS_PRIVATE = "the channel is private";
	static readonly INSUFICIENT_PERMISSION = "insuficient permission";
	static readonly CANT_INVITE_TO_NON_PRIVATE_CHANNEL = "cant invite to non private channel";
	static readonly CANT_CREATE_PROTECTED_CHANNEL_WO_PASSW = "cant create protected channel wo passw";

  static readonly CHANNEL_ALREADY_EXISTS = "channel already exists";
}

export type DMFromServer =  {source: Id, content: string};
export type DMToServer =  {target: Id, content: string};
export type CMFromServer =  {source: Id, channel: string, content: string};
export type CMToServer =  {channel: string, content: string};
export type JoinChannelFromServer = {channel: string, newUser: Id};
export type JoinChannelToServer = {channel: string, password?:string};
export enum ChannelCategory {
  PUBLIC, PROTECTED, PRIVATE
}
export type CreateChannelToServer = {channel: string, category: ChannelCategory, password?: string};
export type InviteChannelFromServer = {channel: string, source: Id};
export type InviteChannelToServer = {channel: string, target: Id};

export type ChatFeedbackDto = {
  success: boolean,
  errorMessage?: string,
}
export type FeedbackCallback = (feedback: ChatFeedbackDto) => void;

export interface ServerToClientEvents {
  [ChatEvent.MSG_TO_USER]: (dto: DMFromServer) => void;
  [ChatEvent.MSG_TO_CHANNEL]: (dto: CMFromServer) => void;
  [ChatEvent.JOIN_CHANNEL]: (dto: JoinChannelFromServer) => void;
  [ChatEvent.INVITE_TO_PRIVATE_CHANNEL]: (dto: InviteChannelFromServer) => void;
}

export interface ClientToServerEvents {
  [ChatEvent.MSG_TO_USER]: (dto: DMToServer, callback: FeedbackCallback) => void;
  [ChatEvent.MSG_TO_CHANNEL]: (dto: CMToServer, callback: FeedbackCallback) => void;
  [ChatEvent.JOIN_CHANNEL]: (dto: JoinChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.CREATE_CHANNEL]: (dto: CreateChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.INVITE_TO_PRIVATE_CHANNEL]: (dto: InviteChannelToServer, callback: FeedbackCallback) => void;
}
