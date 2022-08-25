/* eslint-disable prettier/prettier */
import { ChatEvent, LoginEvent, GetInfoEvent } from 'backFrontCommon';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
import type {
  BanUserToServer,
  MuteUserToServer,
  CMToServer,
  CreateChannelToServer,
  JoinChannelToServer,
  BlockUserToServer,
  FriendInviteToServer,
  UserInfoToServer,
} from 'backFrontCommon';
import { DMToServer } from 'backFrontCommon';
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
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { ChatService } from './chat/chat.service';
import { GameManagerService } from './pong/game-manager.service';
import { CheckDefinedPipe } from './app.validator';
import { UserService } from './user/user.service';

@WebSocketGateway()
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('AppGateway');

  @WebSocketServer() wss!: Server;
  constructor(
    private loginService: LoginService,
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

  // @UsePipes(new CheckDefinedPipe())
  // @UsePipes(new ValidationPipe())
  @SubscribeMessage(ChatEvent.MSG_TO_USER)
  handlePrivMessage(clientSocket: Socket, dm: DMToServer) {
    // this.logger.log('disconnection');
    this.userService.printAllActiveSocket();
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

  @SubscribeMessage(GetInfoEvent.MY_INFO)
  async handleMyInfo(socket: Socket) {
    return await this.userService.MyInfo(socket);
  }

  @SubscribeMessage(GetInfoEvent.USER_INFO)
  async handleUserInfo(socket: Socket, userInfo: UserInfoToServer) {
    return await this.userService.UserInfo(socket, userInfo);
  }
}
