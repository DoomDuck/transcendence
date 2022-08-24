/* eslint-disable prettier/prettier */
import { ChatEvent, LoginEvent,GetInfoEvent } from 'backFrontCommon';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
import { ConfigService } from '@nestjs/config';
import type {
GetUser,
  BanUserToServer,
  MuteUserToServer,
  DMToServer,
  CMToServer,
  CreateChannelToServer,
  JoinChannelToServer,
  BlockUserToServer,
  FriendInviteToServer,
  UserInfoToServer,
MatchInfoToServer,
} from 'backFrontCommon';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';

type Socket = IOSocketBaseType<ClientToServerEvents, ServerToClientEvents>;
type Server = IOServerBaseType<ClientToServerEvents, ServerToClientEvents>;
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
import { ChannelManagerService } from './channelManager/channelManager.service';
import { MatchHistoryService } from './matchHistory/matchHistory.service';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { GameManagerService } from './pong/game-manager.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() wss!: Server;
  constructor(
    private loginService: LoginService,
	// private matchHistoryService : MatchHistoryService,
    private chatService: ChatService,
    private userService: UserService,
    private gameManagerService: GameManagerService,
  ) {}

  afterInit() {
    this.logger.log('Initialized chat ');
  }

  async handleConnection(socket: Socket) {
    await this.loginService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket) {
    this.loginService.handleDisconnect(socket);
  }

  @SubscribeMessage(LoginEvent.TOTP_CHECK)
  async onTotpCheck(socket: Socket, token: string) {
    await this.loginService.onTotpCheck(socket, token);
  }

  @SubscribeMessage(ChatEvent.BLOCK_USER)
  async handleBlockUser(clientSocket: Socket, blockInfo: BlockUserToServer) {
    return await this.chatService.handleBlockUser(clientSocket, blockInfo);
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
    return this.chatService.handlePrivMessage(clientSocket, dm, this.wss);
  }

  @SubscribeMessage(ChatEvent.FRIEND_INVITE)
  async handleFriendInvite(
    clientSocket: Socket,
    friendRequest: FriendInviteToServer,
  ) {
    return await this.chatService.handleFriendInvite(
      clientSocket,
      friendRequest,
    );
  }

  @SubscribeMessage(ChatEvent.BAN_USER)
  async handleBanUser(clientSocket: Socket, banInfo: BanUserToServer) {
    return await this.chatService.handleBanUser(
      clientSocket,
      banInfo,
      this.wss,
    );
  }

  @SubscribeMessage(ChatEvent.MUTE_USER)
  async handleMuteUser(clientSocket: Socket, muteInfo: MuteUserToServer) {
    return await this.chatService.handleMuteUser(
      clientSocket,
      muteInfo,
      this.wss,
    );
  }

  @SubscribeMessage('joinMatchMaking')
  handleJoinMatchMaking(socket: Socket) {
    this.gameManagerService.add(socket);
  }

  @SubscribeMessage('observe')
  handleObserve(socket: Socket, gameId: number) {
    this.gameManagerService.addObserver(socket, gameId);
  }
// @SubscribeMessage(GetInfoEvent.MY_INFO)
  // async handleMyInfo(socket: Socket) {
    // return await this.userService.MyInfo(socket);
  // }
//
// @SubscribeMessage(GetInfoEvent.USER_INFO)
  // async handleUserInfo(socket: Socket, userInfo:UserInfoToServer ) {
    // return await this.userService.UserInfo(socket, userInfo);
  // }
// @SubscribeMessage(GetInfoEvent.ALL_MATCH)
  // async handleAllMatch(socket: Socket) {
    // return  await this.matchHistoryService.getAllMatch();
  // }
// @SubscribeMessage(GetInfoEvent.MY_MATCH)
  // async handleMyMatch(socket: Socket) {
    // return  await this.userService.getMyMatch(socket);
  // }
// @SubscribeMessage(GetInfoEvent.USER_MATCH)
  // async handleUserMatch(socket: Socket,matchInfo:MatchInfoToServer ) {
    // return  await this.userService.getUserMatch(socket,matchInfo.target);
  // }
//
// @SubscribeMessage(ChatEvent.GET_USER)
  // async handleGetUserChat(socket: Socket,userId:GetUser ) {
    // return await this.userService.getUserChat(socket,userId.target);
  // }
}