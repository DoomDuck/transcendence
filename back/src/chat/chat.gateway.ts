import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import {
  ChatEvent,
  ChatError,
  ChatFeedbackDto,
  LoginEvent,
} from 'backFrontCommon';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
import { Id } from 'backFrontCommon';
import { ConfigService } from '@nestjs/config';
import type {
  BanUserToServer,
  MuteUserToServer,
  DMToServer,
  CMToServer,
  CreateChannelToServer,
  JoinChannelToServer,
  BlockUserToServer,
  FriendInviteToServer,
} from 'backFrontCommon';
import { UserDto } from '../user/dto/user.dto';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
import fetch from 'node-fetch';

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
import { Logger } from '@nestjs/common';
import { TOTP, Secret } from 'otpauth';

@WebSocketGateway({ namespace: '/chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss!: Server;
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private channelManagerService: ChannelManagerService,
  ) {}
  private logger: Logger = new Logger('ChatGateway');
  afterInit(server: any) {
    this.logger.log('Initialized chat ');
  }

  // Random login for guest
  generateRandomId(): number {
    return Math.floor(Math.random() * 1_000);
  }

  async handleConnection(clientSocket: Socket) {
  }

  handleDisconnect(clientSocket: Socket) {
    this.logger.log(`Client connected: ${clientSocket.id}`);
    this.logger.log(clientSocket.handshake.auth.code);
    this.userService.disconnection(clientSocket);
  }

  @SubscribeMessage(ChatEvent.BLOCK_USER)
  async handleBlockUser(clientSocket: Socket, blockInfo: BlockUserToServer) {
    const sender = await this.userService.findOneDbBySocket(clientSocket);
    if (!sender)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    const target = await this.userService.findOneDb(blockInfo.target);
    if (!target)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.USER_NOT_FOUND,
      );
    return this.userService.blockUser(sender, target);
  }
  @SubscribeMessage(ChatEvent.CREATE_CHANNEL)
  async handleCreateChannel(
    clientSocket: Socket,
    chanInfo: CreateChannelToServer,
  ) {
    const tempUser = this.userService.findOneActiveBySocket(clientSocket);
    if (!tempUser)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    const newChan = await this.channelManagerService.createChan(
      tempUser,
      chanInfo,
    );
    if (!newChan)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    this.channelManagerService.joinChan(tempUser, newChan);
    this.userService.joinChanUser(tempUser, newChan);
    return this.channelManagerService.newChatFeedbackDto(true);
  }

  @SubscribeMessage(ChatEvent.MSG_TO_CHANNEL)
  async handleMessageChannel(clientSocket: Socket, dto: CMToServer) {
    const tempChannel = await this.channelManagerService.findChanByName(
      dto.channel,
    );

    if (!tempChannel)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    const tempSender = this.userService.findOneActiveBySocket(clientSocket);
    if (!tempSender) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    const feedback = this.channelManagerService.msgToChannelVerif(
      tempChannel,
      tempSender,
    );
    if (!feedback) return feedback;
    this.logger.log(`sender: ${tempSender!.name}`);
    this.logger.log(`channel: ${tempChannel!.name}`);
    tempChannel!.member.forEach((member: Id) => {
      const tempUser = this.userService.findOneActive(member);
      if (tempUser)
        this.userService.updateChannelConversation(
          tempSender,
          tempUser,
          tempChannel!,
          dto.content,
        );
    });
    clientSocket
      .to(tempChannel!.name)
      .except(await this.userService.getArrayBlockedFrom(tempSender))
      .emit(ChatEvent.MSG_TO_CHANNEL, {
        source: tempSender!.id,
        channel: tempChannel!.name,
        content: dto.content,
      });

    return this.channelManagerService.newChatFeedbackDto(true);
  }

  @SubscribeMessage(ChatEvent.JOIN_CHANNEL)
  async handleJoinChannel(clientSocket: Socket, joinInfo: JoinChannelToServer) {
    let feedback: ChatFeedbackDto;
    const tempChan = await this.channelManagerService.findChanByName(
      joinInfo.channel,
    );
    const tempUser = this.userService.findOneActiveBySocket(clientSocket);

    this.logger.log(`any joiner in the  chat ?${tempUser} `);
    if (!tempChan) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    }
    if (!tempUser) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    feedback = await this.channelManagerService.joinChan(tempUser, tempChan);
    if (feedback.success === true) {
      this.logger.log(`joining chanUSer `);
      this.userService.joinChanUser(tempUser, tempChan);
    }

    return feedback;
  }

  @SubscribeMessage(ChatEvent.MSG_TO_USER)
  handlePrivMessage(clientSocket: Socket, dm: DMToServer) {
    const sender = this.userService.findOneActiveBySocket(clientSocket);
    if (!sender) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    const target = this.userService.findOneActive(dm.target);
    if (!target) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.USER_NOT_FOUND,
      );
    }
    const feedback = this.userService.sendMessageToUser(
      sender,
      this.wss,
      dm.content,
      target,
    );
    console.log(feedback);
    return feedback;
  }

  @SubscribeMessage(ChatEvent.FRIEND_INVITE)
  async handleFriendInvite(
    clientSocket: Socket,
    friendRequest: FriendInviteToServer,
  ) {
    const sender = await this.userService.findOneDbBySocket(clientSocket);
    if (!sender) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    const target = await this.userService.findOneDb(friendRequest.target);
    if (!target) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.USER_NOT_FOUND,
      );
    }
    const feedback = this.userService.addFriend(sender, target);
    return feedback;
  }
  @SubscribeMessage(ChatEvent.BAN_USER)
  async handleBanUser(clientSocket: Socket, banInfo: BanUserToServer) {
    const tempSender = this.userService.findOneActiveBySocket(clientSocket);
    if (!tempSender) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    const tempTarget = this.userService.findOneActive(banInfo.target);
    if (!tempTarget) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.USER_NOT_FOUND,
      );
    }
    const tempChan = await this.channelManagerService.findChanByName(
      banInfo.channel,
    );
    if (!tempChan) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    }
    const feedback = this.channelManagerService.banUser(
      tempSender,
      tempTarget,
      tempChan,
      banInfo.duration,
      this.wss,
    );
    if (feedback.success === true) {
      this.channelManagerService.leaveChannel(tempChan, tempTarget);
    }
    return feedback;
  }
  @SubscribeMessage(ChatEvent.MUTE_USER)
  async handleMuteUser(clientSocket: Socket, muteInfo: MuteUserToServer) {
    const tempSender = this.userService.findOneActiveBySocket(clientSocket);
    if (!tempSender) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.U_DO_NOT_EXIST,
      );
    }
    const tempTarget = this.userService.findOneActive(muteInfo.target);
    if (!tempTarget) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.USER_NOT_FOUND,
      );
    }
    const tempChan = await this.channelManagerService.findChanByName(
      muteInfo.channel,
    );
    if (!tempChan) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    }
    const feedback = this.channelManagerService.muteUser(
      tempSender,
      tempTarget,
      tempChan,
      muteInfo.duration,
      this.wss,
    );
    return feedback;
  }
}
