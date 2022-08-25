import type { UserHistoryDto } from "./chatConversationsDto"
import type { Id } from "./general"
/**
 * Events required to Login
 */
export class LoginEvent {
  static readonly TOTP_REQUIREMENTS = "totp requirements";
  static readonly TOTP_DEMAND_SETUP = "totp demand setup";
  static readonly TOTP_SETUP = "totp setup";
  static readonly TOTP_CHECK = "totp check";
  static readonly TOTP_RESULT = "totp result";
}

export class GetInfoEvent{

  static readonly MY_INFO = "my info";
  static readonly USER_INFO = "user info";
  static readonly MY_MATCH = "my match info";
  static readonly USER_MATCH = "user match info";
  static readonly ALL_MATCH = "all match info";

}
export class ChatEvent {
	static readonly MSG_TO_CHANNEL = "msg to channel"
	static readonly SET_USERNAME = "set username"
	static readonly MSG_TO_USER = 'msg to user'
	static readonly JOIN_CHANNEL = 'join channel'
	static readonly CREATE_CHANNEL = 'create channel'
	static readonly INVITE_TO_PRIVATE_CHANNEL = 'invite to channel'
	static readonly GAME_INVITE = 'game invite'
	static readonly GAME_ACCEPT = 'game accept'
	static readonly GAME_REFUSE = 'game refuse'
	static readonly GAME_CANCEL = 'game cancel'
	static readonly FRIEND_INVITE = 'friend invite'
  static readonly POST_AVATAR=  'post_avatar'
  static readonly GET_FRIENDS =  'get_friends '
  static readonly GET_LEADERBOARD = 'get_leaderboard'
  static readonly GET_CHAT_HISTORY = 'get_chat_history'
  static readonly BLOCK_USER = 'block user'
	static readonly BAN_USER = 'ban user'
	static readonly MUTE_USER = 'mute user'
	static readonly BANNED_NOTIF = 'you are banned from a chan'
	static readonly CHAN_INVIT_NOTIF = 'you are banned from a chan'
	static readonly MUTED_NOTIF = 'you are muted from a chan'
  static readonly JOIN_MATCHMAKING = 'join matchmaking'
  static readonly GAME_OBSERVE = 'game observe'
  static readonly PLAYER_ID_CONFIRMED = 'player id confirmed'
  static readonly GOTO_GAME_SCREEN = 'goto game screen'
  static readonly DELETE_GAME_INVITE = 'delete game invite'
	static readonly SET_PASSWORD = 'set password'
	static readonly SET_NEW_ADMIN = 'set new admin'
}

export class ChatError {
  static readonly U_DO_NOT_EXIST ="u do not exist";
  static readonly USER_NOT_FOUND ="user not found";
  static readonly USER_OFFLINE ="user offline";
  static readonly CHANNEL_NOT_FOUND ="channel not found";
  static readonly WRONG_PASSWORD ="wrong password";
  static readonly YOU_ARE_BANNED ="you are banned";
  static readonly USER_IS_BANNED ="user is banned";
  static readonly YOU_ARE_MUTED ="you are muted";
  static readonly YOU_ARE_BLOCKED ="you are blocked";
  static readonly NOT_IN_CHANNEL ="not in channel";
  static readonly ALREADY_FRIEND = "already friend";
  static readonly ALREADY_IN_CHANNEL = "already in channel";
  static readonly ALREADY_ADMIN = "already admin";
  static readonly NAME_ALREADY_IN_USE = "name already in use";
  static readonly CHANNEL_IS_PRIVATE = "the channel is private";
  static readonly INSUFICIENT_PERMISSION = "insuficient permission";
  static readonly CANT_INVITE_TO_NON_PRIVATE_CHANNEL = "cant invite to non private channel";
  static readonly CANT_CREATE_PROTECTED_CHANNEL_WO_PASSW = "cant create protected channel wo passw";
  static readonly ALREADY_BLOCKED ="user already blocked";
  static readonly ALREADY_BANNED ="user already banned";
  static readonly ALREADY_MUTED ="user already muted";
  static readonly NOT_BANNED ="user not banned";
  static readonly NOT_MUTED ="user not muted";
  static readonly CHANNEL_ALREADY_EXISTS = "channel already exists";
  static readonly NO_SUCH_GAME_INVITATION = "no such game invitation";
}


export type SetPasswordToServer =  {channel: string, password: string};
export type SetNewAdminToServer =  {channel: string, target: Id};
export type DMFromServer =  {source: Id, content: string};
export type DMToServer =  {target: Id, content: string};
export type CMFromServer =  {source: Id, channel: string, content: string};
export type CMToServer =  {channel: string, content: string};
export type JoinChannelFromServer = {channel: string, newUser: Id};
export type JoinChannelToServer = {channel: string, password?:string};
export enum ChannelCategory {
  PUBLIC, PROTECTED, PRIVATE
};

export type MyInfo = {
  id: Id, name: string,
  friendlist: Id[],
  blocked: Id[],
  win: number,
  loose: number,
  score: number,
  ranking: number,
  avatar: string | null,
  totpSecret: string | null,
  inGame: boolean
};
export type UserInfo = {
  id: Id,
  name: string,
  win: number,
  loose: number,
  score: number,
  ranking: number,
  avatar: string | null,
  isOnline: boolean,
  inGame:boolean,
  matchHistory: RelativeMatchInfoFromServer[]
};
export type MatchInfoFromServer = {winner: Id, looser: Id, winnerScore : number, looserScore:number, date : Date};
export type RelativeMatchInfoFromServer = {opponent: Id, winner: boolean, score : number, opponentScore: number};
export type MatchInfoToServer = {target:Id};
export type UserInfoToServer = {target:Id}
export type SetUsernameToServer = {name:string}
export type FriendInviteToServer = {target:Id};
export type CreateChannelToServer = {channel: string, category: ChannelCategory, password?: string};
export type InviteChannelFromServer = {channel: string, source: Id};
export type InviteChannelToServer = {channel: string, target: Id};
export type GameInviteFromServer = { source: Id, classic: boolean };
export type GameInviteToServer = { target: Id, classic: boolean };
export type GameAcceptFromServer = { source: Id };
export type GameAcceptToServer = { target: Id };
export type GameRefuseFromServer = { source: Id, reason?: string };
export type GameRefuseToServer = { target: Id, reason?: string };
export type GameCancelFromServer = { source: Id, reason?: string };
export type GameCancelToServer = { target: Id, reason?: string };
export type DeleteGameInviteFromServer = { target: Id };
export type PostAvatar = { imageDataUrl: string };
export type GetUser = { target: Id };
export type ChanInviteAccept = { channel: string};
export type ChanInviteRefuse = { channel: string };

export type LeaderboardItemDto = {id : number, name : string, victory : number, defeat : number, score : number };
export type GetLeaderBoardResponse = { items: LeaderboardItemDto[] };

export type BlockUserToServer =  {target: Id};
export type BanUserToServer =  {channel:string,target: Id, duration:number};
export type BanUserFromServer =  {channel:string,sender:Id, duration:number};
export type MuteUserToServer =  {channel:string,target: Id, duration:number};
export type MuteUserFromServer =  {channel:string,sender: Id, duration:number};
export type ChatFeedbackDto = {
  success: boolean,
  errorMessage?: string,
}
export type FeedbackCallback = (feedback: ChatFeedbackDto) => void;
export type RequestFeedbackDto<Result> = {
  success: boolean,
  errorMessage?: string,
  result?: Result,
}
export type FeedbackCallbackWithResult<Result> = (feedback: RequestFeedbackDto<Result>) => void;

export interface ServerToClientEvents {
  [ChatEvent.MSG_TO_USER]: (dto: DMFromServer) => void;
  [ChatEvent.MSG_TO_CHANNEL]: (dto: CMFromServer) => void;
  [ChatEvent.JOIN_CHANNEL]: (dto: JoinChannelFromServer) => void;
  [ChatEvent.INVITE_TO_PRIVATE_CHANNEL]: (dto: InviteChannelFromServer) => void;
  [ChatEvent.GAME_INVITE]: (dto: GameInviteFromServer) => void;
  [ChatEvent.GAME_ACCEPT]: (dto: GameAcceptFromServer) => void;
  [ChatEvent.GAME_REFUSE]: (dto: GameRefuseFromServer) => void;
  [ChatEvent.GAME_CANCEL]: (dto: GameCancelFromServer) => void;
  [ChatEvent.GOTO_GAME_SCREEN]: (classic: boolean, callback: () => void) => void;
  [ChatEvent.PLAYER_ID_CONFIRMED]: (playerId: Id, callback: () => void) => void;
	[ChatEvent.DELETE_GAME_INVITE]: (dto: DeleteGameInviteFromServer) => void;

  // [ChatEvent.FRIEND_INVITE]: (dto: FriendInviteFromServer) => void;

  // Login
  [LoginEvent.TOTP_REQUIREMENTS]: (is_required: boolean) => void;
  [LoginEvent.TOTP_SETUP]: (setup_url: string) => void;
  [LoginEvent.TOTP_RESULT]: (success: boolean) => void;
  [ChatEvent.BANNED_NOTIF]: (dto:BanUserFromServer) => void;
  [ChatEvent.MUTED_NOTIF]: (dto:MuteUserFromServer ) => void;
}

export interface ClientToServerEvents {
  [ChatEvent.MSG_TO_USER]: (dto: DMToServer, callback: FeedbackCallback) => void;
  [ChatEvent.MSG_TO_CHANNEL]: (dto: CMToServer, callback: FeedbackCallback) => void;
  [ChatEvent.JOIN_CHANNEL]: (dto: JoinChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.CREATE_CHANNEL]: (dto: CreateChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.INVITE_TO_PRIVATE_CHANNEL]: (dto: InviteChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.FRIEND_INVITE]: (dto: FriendInviteToServer, callback: FeedbackCallback) => void;
  [ChatEvent.POST_AVATAR]: (dto: PostAvatar, callback: FeedbackCallback) => void;
  [ChatEvent.GET_FRIENDS]: (callback: RequestFeedbackDto<Id[]>) => void;
  [ChatEvent.GET_LEADERBOARD]: (callback: RequestFeedbackDto<LeaderboardItemDto[]>) => void;
  [ChatEvent.GET_CHAT_HISTORY]: (callback: RequestFeedbackDto<UserHistoryDto>) => void;
  [ChatEvent.JOIN_MATCHMAKING]: (classic: boolean) => void;
  [ChatEvent.GAME_INVITE]: (dto: GameInviteToServer, callback: FeedbackCallback) => void;
	[ChatEvent.GAME_ACCEPT]: (dto: GameAcceptToServer, callback: FeedbackCallback) => void;
	[ChatEvent.GAME_REFUSE]: (dto: GameRefuseToServer) => void;
  [ChatEvent.GAME_OBSERVE]: (gameId: Id) => void;
  [ChatEvent.GAME_CANCEL]: (dto: GameCancelToServer) => void;

  // Login
  [LoginEvent.TOTP_CHECK]: (token: string) => void,
  [LoginEvent.TOTP_DEMAND_SETUP]: () => void;
  [ChatEvent.BANNED_NOTIF]: (dto:BanUserToServer) => void;
  [ChatEvent.MUTED_NOTIF]: (dto:MuteUserToServer ) => void;

  // GetInfo
  [GetInfoEvent.USER_INFO]: (dto: GetUser, callback: FeedbackCallbackWithResult<UserInfo>) => void;
  [GetInfoEvent.MY_INFO]: (callback: FeedbackCallbackWithResult<MyInfo>) => void;
}
