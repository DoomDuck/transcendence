/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { Id } from 'backFrontCommon';
import {
  ChatFeedbackDto,
  BanUserToServer,
  MuteUserToServer,
  DMToServer,
  CMToServer,
  CreateChannelToServer,
  JoinChannelToServer,
  BlockUserToServer,
  FriendInviteToServer,
  ChatEvent,
  ChatError,
  Server,
  SetPasswordToServer,
  SetNewAdminToServer,
  ChanInviteAccept,
  ChanInviteRefuse,
  InviteChannelToServer,
  InviteChannelFromServer,
  ServerSocket as Socket,
} from 'backFrontCommon';

import { WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@Injectable()
export class ChatService {
  constructor(
    private userService: UserService,
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

  async handleJoinChannel(clientSocket: Socket, joinInfo: JoinChannelToServer) {
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
    const feedback = await this.channelManagerService.joinChan(
      tempUser,
      tempChan,
    );
    if (feedback.success === true) {
      this.logger.log(`joining chanUSer `);
      this.userService.joinChanUser(tempUser, tempChan);
    }

    return feedback;
  }

  async handlePrivMessage(clientSocket: Socket, dm: DMToServer, wss: Server) {
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
    const feedback = await this.userService.sendMessageToUser(
      sender,
      wss,
      dm.content,
      target,
    );
    return feedback;
  }

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
    return await this.userService.addFriend(sender, target);
  }

  async handleBanUser(
    clientSocket: Socket,
    banInfo: BanUserToServer,
    wss: Server,
  ) {
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
      wss,
    );
    if (feedback.success === true) {
      this.channelManagerService.leaveChannel(tempChan, tempTarget);
    }
    return feedback;
  }

  async handleMuteUser(
    clientSocket: Socket,
    muteInfo: MuteUserToServer,
    wss: Server,
  ) {
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
      wss,
    );
    return feedback;
  }
  async setPassword(
    socket: Socket,
    setInfo: SetPasswordToServer,
  ): Promise<ChatFeedbackDto> {
    const user = this.userService.findOneActiveBySocket(socket);
    if (!user)
      return { success: false, errorMessage: ChatError.U_DO_NOT_EXIST };
    const channel = await this.channelManagerService.findChanByName(
      setInfo.channel,
    );

    if (!channel)
      return { success: false, errorMessage: ChatError.CHANNEL_NOT_FOUND };
    else
      return await this.channelManagerService.setPassword(
        user,
        channel,
        setInfo.password,
      );
  }
  async handleSetNewAdmin(
    socket: Socket,
    setInfo: SetNewAdminToServer,
  ): Promise<ChatFeedbackDto> {
    const user = this.userService.findOneActiveBySocket(socket);
    if (!user)
      return { success: false, errorMessage: ChatError.U_DO_NOT_EXIST };
    const channel = await this.channelManagerService.findChanByName(
      setInfo.channel,
    );
    if (!channel)
      return { success: false, errorMessage: ChatError.CHANNEL_NOT_FOUND };
    const target = this.userService.findOneActive(setInfo.target);
    if (!target)
      return { success: false, errorMessage: ChatError.USER_NOT_FOUND };
    return await this.channelManagerService.setNewAdmin(user, target, channel);
  }

  async handleInviteChannel(
    socket: Socket,
    inviteInfo: InviteChannelToServer,
    wss: Server,
  ): Promise<ChatFeedbackDto> {
    const sender = this.userService.findOneActiveBySocket(socket);
    if (!sender)
      return { success: false, errorMessage: ChatError.U_DO_NOT_EXIST };
    const channel = await this.channelManagerService.findChanByName(
      inviteInfo.channel,
    );
    if (!channel)
      return { success: false, errorMessage: ChatError.CHANNEL_NOT_FOUND };
    const target = this.userService.findOneActive(inviteInfo.target);
    if (!target)
      return { success: false, errorMessage: ChatError.USER_NOT_FOUND };
    return this.channelManagerService.inviteUserToChannel(
      sender,
      target,
      channel,
      wss,
    );
  }
}
