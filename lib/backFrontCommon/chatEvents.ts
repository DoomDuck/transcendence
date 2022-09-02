// import { IsInt, IsString } from "class-validator";
import type { UserHistoryDto } from "./chatConversationsDto"
import type { Id } from "./general"

/**
 * Events required to Login
 */
export class LoginEvent {
  static readonly SUCCESS = "login success";
  static readonly FAILURE = "login failure";
  static readonly TOTP_REQUIRED = "totp required";
  static readonly TOTP_UPDATE = "totp update";
}

export class GetInfoEvent{
  static readonly MY_INFO = "my info";
  static readonly USER_INFO = "user info";
  static readonly MY_MATCH = "my match info";
  static readonly USER_MATCH = "user match info";
  static readonly ALL_MATCH = "all match info";
  static readonly IS_IN_GAME = "is in game";
}

export class ChatEvent {
  static readonly MSG_TO_CHANNEL = "msg to channel"
  static readonly SET_USERNAME = "set username"
  static readonly MSG_TO_USER = 'msg to user'
  static readonly JOIN_CHANNEL = 'join channel'
  static readonly LEAVE_CHANNEL = 'leave channel'
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
  static readonly MUTE_USER = 'mute user'
  static readonly BANNED_NOTIF = 'you are banned from a chan'
  static readonly CHAN_INVIT_NOTIF = 'chan invite notif'
  static readonly MUTED_NOTIF = 'you are muted from a chan'
  static readonly JOIN_MATCHMAKING = 'join matchmaking'
  static readonly GAME_OBSERVE = 'game observe'
  static readonly PLAYER_ID_CONFIRMED = 'player id confirmed'
  static readonly GOTO_GAME_SCREEN = 'goto game screen'
  static readonly DELETE_GAME_INVITE = 'delete game invite'
  static readonly SET_PASSWORD = 'set password'
  static readonly SET_NEW_ADMIN = 'set new admin'
  static readonly QUIT_MATCHMAKING = 'quit matchmaking'
  static readonly DELETE_CHANNEL = 'delete channel'
  static readonly GET_CHANNEL_INFO = 'get channel info'
  static readonly BAN_USER = 'ban user'
  static readonly CHANNEL_DELETED_NOTIF = 'channel deleted notif'
  static readonly BLOCKED_NOTIF = 'blocked notif'
  static readonly UNBLOCK_USER = 'unblock user'
  static readonly GET_BANNED_IN_CHANNEL = "get banned in channel"
  static readonly UNBAN_USER = "unban user"
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
  static readonly USER_NOT_IN_GAME = "user not in game";
  static readonly YOU_CANT_BE_YOUR_OWN_FRIEND="you can't be your own friend";
  static readonly YOU_CANT_BLOCK_YOURSELF="you can't be your own friend";
  static readonly YOU_CANT_PLAY_WITH_YOURSELF = "you can't play with yourself..... here"
  static readonly CANNOT_INVITE_YOURSELF = "you cannot invite yourself";
  static readonly MUST_SPECIFY_PASSWORD = "must specify password";
}

export class DMFromServer  {
  constructor(
    public source: Id,
    public content: string,
	public isMe?:boolean
  ) { }
}

export class DMToServer {
  // @IsInt()
  target: Id;
  // @IsString()
  content: string;

  constructor(
    target: Id,
    content: string,
  ) {
    this.target = target;
    this.content = content;
  }
}

export class CMFromServer  {
  constructor(
    public source: Id,
    public channel: string,
    public content: string,
  ) { }
}

export class CMToServer  {
  constructor(
    public channel: string,
    public content: string,
  ) { }
}

export class JoinChannelFromServer {
  constructor(
    public channel: string,
    public newUser: Id,
  ) { }
}

export class JoinChannelToServer {
  constructor(
    public channel: string,
    public password?:string,
  ) { }
}

export class SetPasswordToServer {
  constructor(
    public channel: string,
    public password: string
  ) { }
}
export class SetNewAdminToServer {
  constructor(
    public channel: string,
    public target: Id
  ) { }
}

export enum ChannelCategory {
  PUBLIC, PROTECTED, PRIVATE
};

export class FriendInviteToServer {
  constructor(public target: Id)  { }
}

export class CreateChannelToServer {
  constructor(
    public channel: string,
    public category: ChannelCategory,
    public password?: string,
  ) { }
}

export class InviteChannelFromServer {
  constructor(
    public channel: string,
    public source: Id
  ) { }
}

export class InviteChannelToServer {
  constructor(
    public channel: string,
    public target: Id,
  ) { }
}

export class GameInviteFromServer {
  constructor(public source: Id, public classic: boolean) { }
}

export class GameInviteToServer {
  constructor(public target: Id, public classic: boolean) { }
}

export class GameAcceptFromServer {
  constructor(public source: Id) { }
}

export class GameAcceptToServer {
  constructor(public target: Id) { }
}

export class GameRefuseFromServer {
  constructor(
    public source: Id,
    public reason?: string,
  ) { }
}

export class GameRefuseToServer {
  constructor(
    public target: Id,
    public reason?: string,
  ) { }
}

export class PostAvatar {
  constructor(public imageDataUrl: string) {  }
}

export class GetUser {
  constructor(public target: Id) { }
}

export class LeaderboardItemDto {
  constructor(
    public id : number,
    public name : string,
    public victory : number,
    public defeat : number,
    public score : number,
  ) { }
}

export class GetLeaderBoardResponse {
  constructor(public items: LeaderboardItemDto[]) {  }
}

export class BlockUserToServer  {
  constructor(public target: Id) { }
}

export class BanUserToServer  {
  constructor(
    public channel:string,
    public target: Id,
    public duration:number,
  ) { }
}

export class MatchInfoToServer {
  constructor(public target: Id) { }
}

export class MatchInfoFromServer {
  constructor(
   public winner: Id,
   public looser: Id,
   public winnerScore : number,
   public looserScore:number,
   public date : Date
  ) { }
};

export class RelativeMatchInfoFromServer {
  constructor(
    public opponent: Id,
    public winner: boolean,
    public score : number,
    public opponentScore: number
  ) { }
};

export class GetBannedListToServer   {
  constructor(
    public channel:string
  ) { }
}
export class GetBannedListFromServer   {
  constructor(
    public users:Id[]
  ) { }
}
export class SetUsernameToServer   {
  constructor(
    public name:string
  ) { }
}

export class GameCancelFromServer   {
  constructor(
    public source: Id,
    public reason?: string,
  ) { }
}

export class GameCancelToServer   {
  constructor(
    public target: Id,
    public reason?: string,
  ) { }
}

export class DeleteGameInviteFromServer   {
  constructor(
    public target: Id
  ) { }
}

export class ChanInviteAccept   {
  constructor(
    public channel: string,
  ) { }
}

export class ChanInviteRefuse   {
  constructor(
    public channel: string,
  ) { }
}

export class MyInfo {
  constructor (
    public id: Id,
    public name: string,
    public friendlist: Id[],
    public blocked: Id[],
    public channels: string[],
    public win: number,
    public loose: number,
    public score: number,
    public ranking: number,
    public avatar: string | null,
    public totpSecret: string | null,
    public inGame: boolean
  ) { }
};

export class UserInfo  {
  constructor(
    public id: Id,
    public name: string,
    public win: number,
    public loose: number,
    public score: number,
    public ranking: number,
    public avatar: string | null,
    public isOnline: boolean,
    public inGame: boolean,
    public matchHistory: RelativeMatchInfoFromServer[]
  ) { }
};

export class UserInfoToServer {
  constructor(public target: Id) { }
}

export class BanUserFromServer  {
  constructor(
    public channel:string,
    public sender:Id,
    public duration:number,
  ) { }
}

export class MuteUserToServer  {
  constructor(
    public channel:string,
    public target: Id,
    public duration:number,
  ) { }
}

export class MuteUserFromServer {
  constructor(
    public channel:string,
    public sender: Id,
    public duration:number,
  ) { }
};
export class DeleteChannelToServer
{
	constructor(
	  public channel:string
	){ }
}
export class IsInGameToServer {
  constructor (public target: Id) { }
}
export class GetChannelInfoToServer {
  constructor (public channel: string) { }
}
export enum ChannelRights {
  OWNER,
  ADMIN,
  USER
}
export class ChannelUser {
  constructor(
    public id: Id,
    public rights: ChannelRights,
    public muted: boolean
  ) { }
}
export class ChannelInfo {
  constructor (
    public users: ChannelUser[],
    public bannedUsers: Id[],
    public channelType: ChannelCategory,
  ) { }
}
export class LeaveChannelToServer {
  constructor(
    public channel: string,
  ) { }
}
export class ChannelDeletedFromServer {
  constructor(
    public channel: string,
  ) { }
}
export class BlockUserFromServer {
  constructor(
    public source: Id,
  ) { }
}
export class UnblockUserToServer {
  constructor(
    public target: Id
  ) { }
}
export class UnbanUserToServer {
  constructor(
    public channel: string,
    public target: Id
  ) { }
}

export class ChatFeedbackDto {
  constructor(
    public success: boolean,
    public errorMessage?: string,
  ) { }
}

export type FeedbackCallback = (feedback: ChatFeedbackDto) => void;

export class RequestFeedbackDto<Result> {
  constructor(
    public success: boolean,
    public errorMessage?: string,
    public result?: Result,
  ) { }
}

export type FeedbackCallbackWithResult<Result> = (feedback: RequestFeedbackDto<Result>) => void;

export interface ServerToClientEvents {
  // Login
  [LoginEvent.SUCCESS]: () => void;
  [LoginEvent.FAILURE]: () => void;
  [LoginEvent.TOTP_REQUIRED]: (callback: (token: string) => void) => void;

  // Chat
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

  [ChatEvent.BANNED_NOTIF]: (dto:BanUserFromServer) => void;
  [ChatEvent.BLOCKED_NOTIF]: (dto:BlockUserFromServer) => void;
  [ChatEvent.MUTED_NOTIF]: (dto:MuteUserFromServer) => void;
  [ChatEvent.CHANNEL_DELETED_NOTIF]: (dto: ChannelDeletedFromServer) => void;

  // [ChatEvent.FRIEND_INVITE]: (dto: FriendInviteFromServer) => void;
}

export interface ClientToServerEvents {
  // Login
  [LoginEvent.TOTP_UPDATE]: (secret: string | null, callback: (arg: number) => void) => void;

  // UserInfo
  [GetInfoEvent.MY_INFO]: (callback: FeedbackCallbackWithResult<MyInfo>) => void;
  [GetInfoEvent.USER_INFO]: (dto: GetUser, callback: FeedbackCallbackWithResult<UserInfo>) => void;
  [GetInfoEvent.IS_IN_GAME]: (dto: IsInGameToServer, callback: FeedbackCallbackWithResult<boolean>) => void;

  // Chat
  [ChatEvent.MSG_TO_USER]: (dto: DMToServer, callback: FeedbackCallback) => void;
  [ChatEvent.MSG_TO_CHANNEL]: (dto: CMToServer, callback: FeedbackCallback) => void;
  [ChatEvent.JOIN_CHANNEL]: (dto: JoinChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.CREATE_CHANNEL]: (dto: CreateChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.INVITE_TO_PRIVATE_CHANNEL]: (dto: InviteChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.FRIEND_INVITE]: (dto: FriendInviteToServer, callback: FeedbackCallback) => void;
  [ChatEvent.POST_AVATAR]: (dto: PostAvatar, callback: FeedbackCallback) => void;
  [ChatEvent.GET_FRIENDS]: (callback: FeedbackCallbackWithResult<Id[]>) => void;
  [ChatEvent.GET_LEADERBOARD]: (callback: FeedbackCallbackWithResult<LeaderboardItemDto[]>) => void;
  [ChatEvent.GET_CHAT_HISTORY]: (callback: FeedbackCallbackWithResult<UserHistoryDto>) => void;
  [ChatEvent.JOIN_MATCHMAKING]: (classic: boolean) => void;
  [ChatEvent.GAME_INVITE]: (dto: GameInviteToServer, callback: FeedbackCallback) => void;
  [ChatEvent.GAME_ACCEPT]: (dto: GameAcceptToServer, callback: FeedbackCallback) => void;
  [ChatEvent.GAME_REFUSE]: (dto: GameRefuseToServer) => void;
  [ChatEvent.GAME_OBSERVE]: (userId: Id, callback: FeedbackCallback) => void;
  [ChatEvent.GAME_CANCEL]: (dto: GameCancelToServer) => void;
  [ChatEvent.BAN_USER]: (dto: BanUserToServer, callback: FeedbackCallback) => void;
  [ChatEvent.MUTE_USER]: (dto: MuteUserToServer, callback: FeedbackCallback) => void;
  [ChatEvent.QUIT_MATCHMAKING]: () => void;
  [ChatEvent.DELETE_CHANNEL]: (dto:DeleteChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.GET_CHANNEL_INFO]: (dto: GetChannelInfoToServer, callback: FeedbackCallbackWithResult<ChannelInfo>) => void;
  [ChatEvent.BLOCK_USER]: (dto: BlockUserToServer, callback: FeedbackCallback) => void;
  [ChatEvent.SET_USERNAME]: (dto: SetUsernameToServer, callback: FeedbackCallback) => void;
  [ChatEvent.LEAVE_CHANNEL]: (dto: LeaveChannelToServer, callback: FeedbackCallback) => void;
  [ChatEvent.SET_NEW_ADMIN]: (dto: SetNewAdminToServer, callback: FeedbackCallback) => void;
  [ChatEvent.UNBLOCK_USER]: (dto: UnblockUserToServer, callback: FeedbackCallback) => void;
  [ChatEvent.GET_BANNED_IN_CHANNEL]: (dto: GetBannedListToServer, callback: FeedbackCallbackWithResult<GetBannedListFromServer>) => void;
  [ChatEvent.UNBAN_USER]: (dto: UnbanUserToServer, callback: FeedbackCallback) => void;
}
