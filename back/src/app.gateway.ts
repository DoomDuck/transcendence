/* eslint-disable prettier/prettier */
import {
  ChatEvent,
  ChatFeedbackDto,
  GameAcceptToServer,
  GameCancelToServer,
  GameInviteToServer,
  GameRefuseToServer,
  LoginEvent,
  GetInfoEvent,
  RequestFeedbackDto,
  PostAvatar,
  LeaderboardItemDto,
  MatchInfoToServer,
  LeaveChannelToServer,
  UserInfoToServer,
  ChannelUser,
  GetBannedListToServer,
  GetBannedListFromServer,
  Id,
  IsInGameToServer,
} from 'backFrontCommon';
import type {
  UserHistoryDto,
  InviteChannelToServer,
  GetUser,
  SetNewAdminToServer,
  BanUserToServer,
  MuteUserToServer,
  CMToServer,
  CreateChannelToServer,
  JoinChannelToServer,
  BlockUserToServer,
  FriendInviteToServer,
  UnbanUserToServer,
  UserInfo,
  MatchInfoFromServer,
  SetPasswordToServer,
  UnblockUserToServer,
  DeleteChannelToServer,
  GetChannelInfoToServer,
  UnmuteUserToServer,
  FeedbackCallbackWithResult,
  ChannelInfo,
  SetUsernameToServer,
} from 'backFrontCommon';
import { DMToServer } from 'backFrontCommon';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
} from '@nestjs/websockets';
import { LoginService } from './login/login.service';
import { UserService } from './user/user.service';
import { MatchHistoryService } from './matchHistory/matchHistory.service';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { GameManagerService } from './pong/game-manager.service';
import { ServerSocket as Socket, Server } from 'backFrontCommon';
import { GameEvent } from 'pong/common/constants';
@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() wss!: Server;
  constructor(
    private loginService: LoginService,
    private matchHistoryService: MatchHistoryService,
    private chatService: ChatService,
    private userService: UserService,
    private gameManagerService: GameManagerService,
  ) {}

  afterInit() {
    this.logger.log('Initialized chat ');
  }

  async handleConnection(socket: Socket) {
    await this.loginService.handleConnection(socket);

    // DEBUG
    socket.onAny((event: string, ...args: any[]) => {
      // if (Object.getOwnPropertyNames(GameEvent).includes(event)) return;
      console.log(
        `[RECEIVED] event: '${event}' | args: ${JSON.stringify(args)}`,
      );
    });
    socket.prependAnyOutgoing((event: string, ...args: any[]) => {
      // if (Object.getOwnPropertyNames(GameEvent).includes(event)) return;
      console.log(`[SENT] event '${event}' with args: ${JSON.stringify(args)}`);
    });
  }

  handleDisconnect(socket: Socket) {
    this.loginService.handleDisconnect(socket);
  }

  @SubscribeMessage(LoginEvent.TOTP_UPDATE)
  async onTotpUpdate(socket: Socket, secret: string | null) {
    await this.loginService.onTotpUpdate(socket, secret);
    return {}; // Send feedback
  }
  @SubscribeMessage(ChatEvent.GET_LEADERBOARD)
  async getLeaderboard(socket: Socket) {
    this.logger.debug('dans get leaderboard appgateway');
    return await this.userService.getLeaderboard(socket);
  }
  @SubscribeMessage(GetInfoEvent.GET_CHANNELS_LIST)
  async getChannelsList(socket: Socket) {
    return await this.chatService.getChannelsList(socket);
  }

  @SubscribeMessage(ChatEvent.BLOCK_USER)
  async handleBlockUser(clientSocket: Socket, blockInfo: BlockUserToServer) {
    this.logger.log('Dans ban User');
    return await this.chatService.handleBlockUser(clientSocket, blockInfo);
  }

  @SubscribeMessage(ChatEvent.LEAVE_CHANNEL)
  async handleLeaveChannel(
    clientSocket: Socket,
    leaveInfo: LeaveChannelToServer,
  ) {
    this.logger.log('Dans ban User');
    return await this.chatService.handleLeaveChannel(clientSocket, leaveInfo);
  }

  @SubscribeMessage(ChatEvent.CREATE_CHANNEL)
  async handleCreateChannel(
    clientSocket: Socket,
    chanInfo: CreateChannelToServer,
  ) {
    return await this.chatService.handleCreateChannel(clientSocket, chanInfo);
  }

  @SubscribeMessage(ChatEvent.MSG_TO_CHANNEL)
  async handleMessageChannel(clientSocket: Socket, dto: CMToServer) {
    return await this.chatService.handleMessageChannel(clientSocket, dto);
  }

  @SubscribeMessage(ChatEvent.JOIN_CHANNEL)
  async handleJoinChannel(clientSocket: Socket, joinInfo: JoinChannelToServer) {
    return await this.chatService.handleJoinChannel(clientSocket, joinInfo);
  }
  @SubscribeMessage(ChatEvent.MSG_TO_USER)
  handlePrivMessage(clientSocket: Socket, dm: DMToServer) {
    this.userService.printAllActiveSocket();
    return this.chatService.handlePrivMessage(clientSocket, dm, this.wss);
  }

  @SubscribeMessage(ChatEvent.FRIEND_INVITE)
  async handleFriendInvite(
    clientSocket: Socket,
    friendRequest: FriendInviteToServer,
  ) {
    this.logger.debug('dans friend invite');
    return await this.chatService.handleFriendInvite(
      clientSocket,
      friendRequest,
    );
  }

  @SubscribeMessage(ChatEvent.BAN_USER)
  async handleBanUser(clientSocket: Socket, banInfo: BanUserToServer) {
    this.logger.log('Dans ban User');
    return await this.chatService.handleBanUser(
      clientSocket,
      banInfo,
      this.wss,
    );
  }

  @SubscribeMessage(ChatEvent.MUTE_USER)
  async handleMuteUser(clientSocket: Socket, muteInfo: MuteUserToServer) {
    this.logger.log('mute ban User');
    return await this.chatService.handleMuteUser(
      clientSocket,
      muteInfo,
      this.wss,
    );
  }

  @SubscribeMessage(ChatEvent.JOIN_MATCHMAKING)
  handleJoinMatchMaking(socket: Socket, classic: boolean) {
    return this.gameManagerService.addMatchmaking(socket, classic);
  }

  @SubscribeMessage(ChatEvent.GAME_OBSERVE)
  async handleObserve(socket: Socket, userId: Id): Promise<ChatFeedbackDto> {
    return this.gameManagerService.handleObserve(socket, userId);
  }

  @SubscribeMessage(ChatEvent.GAME_INVITE)
  async handleGameInvite(
    sourceSocket: Socket,
    dto: GameInviteToServer,
  ): Promise<ChatFeedbackDto> {
    return this.gameManagerService.handleGameInvite(sourceSocket, dto);
  }

  @SubscribeMessage(ChatEvent.GAME_ACCEPT)
  async handleGameAccept(
    targetSocket: Socket,
    dto: GameAcceptToServer,
  ): Promise<ChatFeedbackDto> {
    return this.gameManagerService.handleGameAccept(targetSocket, dto);
  }

  @SubscribeMessage(ChatEvent.GAME_REFUSE)
  async handleGameRefuse(targetSocket: Socket, dto: GameRefuseToServer) {
    this.gameManagerService.handleGameRefuse(targetSocket, dto);
  }

  @SubscribeMessage(ChatEvent.GAME_CANCEL)
  async handleGameCancel(sourceSocket: Socket, dto: GameCancelToServer) {
    this.gameManagerService.handleGameCancel(sourceSocket, dto);
  }

  @SubscribeMessage(GetInfoEvent.MY_INFO)
  async handleMyInfo(socket: Socket) {
    return await this.userService.MyInfo(socket);
  }

  @SubscribeMessage(GetInfoEvent.USER_INFO)
  async handleUserInfo(socket: Socket, userInfo: UserInfoToServer) {
    return await this.userService.UserInfo(socket, userInfo);
  }

  @SubscribeMessage(GetInfoEvent.ALL_MATCH)
  async handleAllMatch(_socket: Socket) {
    return await this.matchHistoryService.getAllMatch();
  }

  // @SubscribeMessage(GetInfoEvent.MY_MATCH)
  // async handleMyMatch(socket: Socket) {
  // return await this.userService.getMyMatch(socket);
  // }
  //
  // @SubscribeMessage(GetInfoEvent.USER_MATCH)
  // async handleUserMatch(socket: Socket, matchInfo: MatchInfoToServer) {
  // return await this.userService.getUserMatch(socket, matchInfo.target);
  // }
  @SubscribeMessage(ChatEvent.UNBLOCK_USER)
  async handleUnblockUser(socket: Socket, unblockInfo: UnblockUserToServer) {
    return await this.userService.handleUnblockUser(socket, unblockInfo);
  }

  @SubscribeMessage(ChatEvent.UNBAN_USER)
  async handleUnbanUser(socket: Socket, unBanInfo: UnbanUserToServer) {
    return await this.chatService.handleUnbanUser(socket, unBanInfo);
  }

  @SubscribeMessage(ChatEvent.UNMUTE_USER)
  async handleUnmuteUser(socket: Socket, unmuteInfo: UnmuteUserToServer) {
    return await this.chatService.handleUnmuteUser(socket, unmuteInfo);
  }
  @SubscribeMessage(ChatEvent.SET_USERNAME)
  async handleSetUsername(socket: Socket, setInfo: SetUsernameToServer) {
    return await this.userService.setUsername(socket, setInfo.name);
  }

  @SubscribeMessage(ChatEvent.SET_PASSWORD)
  async handleSetPassword(socket: Socket, setInfo: SetPasswordToServer) {
    return await this.chatService.setPassword(socket, setInfo);
  }

  @SubscribeMessage(ChatEvent.SET_NEW_ADMIN)
  async handleSetNewAdmin(socket: Socket, setInfo: SetNewAdminToServer) {
    return await this.chatService.handleSetNewAdmin(socket, setInfo);
  }

  @SubscribeMessage(ChatEvent.INVITE_TO_PRIVATE_CHANNEL)
  async handleSetInviteChannel(
    socket: Socket,
    inviteInfo: InviteChannelToServer,
  ) {
    return await this.chatService.handleInviteChannel(
      socket,
      inviteInfo,
      this.wss,
    );
  }

  @SubscribeMessage(ChatEvent.POST_AVATAR)
  async handlePostAvatar(socket: Socket, avatarInfo: PostAvatar) {
    return await this.userService.handlePostAvatar(socket, avatarInfo);
  }

  @SubscribeMessage(ChatEvent.GET_CHAT_HISTORY)
  async handleGetHistory(
    socket: Socket,
  ): Promise<RequestFeedbackDto<UserHistoryDto>> {
    console.log(
      `VOICI : ${JSON.stringify(
        await this.userService.getUserHistory(socket),
      )}`,
    );
    return this.userService.getUserHistory(socket);
  }

  @SubscribeMessage(ChatEvent.QUIT_MATCHMAKING)
  async handleQuitMatchmaking(socket: Socket) {
    this.gameManagerService.handleQuitMatchmaking(socket);
  }

  @SubscribeMessage(GetInfoEvent.IS_IN_GAME)
  async handleIsInGame(
    socket: Socket,
    { target }: IsInGameToServer,
  ): Promise<RequestFeedbackDto<boolean>> {
    const user = await this.userService.findOneActive(target);
    const inGame = user?.inGame ?? false;
    return { success: true, result: inGame };
  }

  @SubscribeMessage(ChatEvent.DELETE_CHANNEL)
  async handleDeleteChannel(socket: Socket, deleteInfo: DeleteChannelToServer) {
    return this.chatService.handleDeleteChannel(socket, deleteInfo);
  }
  @SubscribeMessage(ChatEvent.GET_CHANNEL_INFO)
  async handleGetChannelInfo(
    socket: Socket,
    chatInfo: GetChannelInfoToServer,
  ): Promise<RequestFeedbackDto<ChannelInfo>> {
    this.logger.log(
      `dans get channel info ${JSON.stringify(
        (await this.chatService.handleGetChannelInfo(socket, chatInfo)).result,
      )}`,
    );
    return await this.chatService.handleGetChannelInfo(socket, chatInfo);
  }
}
