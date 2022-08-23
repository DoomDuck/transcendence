import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { ChatEvent } from 'backFrontCommon';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
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
import { ChatError, ChatFeedbackDto } from 'backFrontCommon';
import { UserDto } from '../user/dto/user.dto';
import { Id } from 'backFrontCommon';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
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
    let code = clientSocket.handshake.auth.code;
    this.logger.log(`Client connected: ${clientSocket.id}`, code);
    // Guest login
    // TODO: Don't use random id
    const tempUser = this.userService.findOneActiveBySocket(clientSocket);
    if (tempUser) {
      this.userService.addNewSocketUser(tempUser, clientSocket);
      return;
    }
    if (!(typeof code == 'string')) {
      let id = this.generateRandomId();

      this.logger.log(`random id = ${id}`);
      await this.userService.addOne(
        new UserDto(id, `guest-${id}`, clientSocket),
      );
      return;
    }
    try {
      const body = JSON.stringify({
        grant_type: 'authorization_code',
        client_id: this.configService.get<string>('PUBLIC_APP_42_ID'),
        client_secret: this.configService.get<string>('APP_42_SECRET'),
        code,
        redirect_uri: this.configService.get<string>('REDIRECT_URI'),
      });
      const reponse = await fetch(`https://api.intra.42.fr/oauth/token/`, {
        method: 'POST',
        body,
        headers: { 'Content-Type': 'application/json' },
      });
      const r2 = await reponse.json();
      const access_token = r2.access_token;

      const headers = {
        Authorization: 'Bearer ' + access_token,
      };
      const r = await fetch('https://api.intra.42.fr/v2/me/', { headers });
      const data = await r.json();
      this.userService.addOne(new UserDto(data.id, data.login, clientSocket));
      this.logger.log(`end handle connection`);
    } catch (e: any) {
      this.logger.log(`in connection fail `, e);
    }
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
