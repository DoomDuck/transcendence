/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { Id } from 'backFrontCommon';
import {
  GetBannedListToServer,
  GetBannedListFromServer,
  ChatFeedbackDto,
  RequestFeedbackDto,
  ChannelInfo,
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
  DeleteChannelToServer,
  GetChannelInfoToServer,
  ChannelUser,
  ServerSocket as Socket,
} from 'backFrontCommon';

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
    if (target.id === sender.id)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.YOU_CANT_BLOCK_YOURSELF,
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
    const tempChan = await this.channelManagerService.findChanByName(
      chanInfo.channel,
    );
    if (tempChan != undefined)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_ALREADY_EXISTS,
      );

    const newChan = await this.channelManagerService.createChan(
      tempUser,
      chanInfo,
    );

    this.logger.debug('after create channel');
    if (!newChan)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.CHANNEL_NOT_FOUND,
      );
    this.channelManagerService.joinChan(tempUser, newChan);
    this.userService.joinChanUser(tempUser, newChan);

    this.logger.debug('end create channel');
    return this.channelManagerService.newChatFeedbackDto(true);
  }

  async handleMessageChannel(clientSocket: Socket, dto: CMToServer) {
    const tempChannel = await this.channelManagerService.findChanByName(
      dto.channel,
    );

    const tempSender = this.userService.findOneActiveBySocket(clientSocket);
    this.logger.log(`sender: ${tempSender!.name}`);
    this.logger.log(`channel: ${tempChannel!.name}`);
    const feedback = this.channelManagerService.msgToChannelVerif(
      tempChannel,
      tempSender,
    );
    if (!feedback.success) return feedback;
    tempChannel!.member.forEach((member: Id) => {
      const tempUser = this.userService.findOneActive(member);
      if (tempUser)
        this.userService.updateChannelConversation(
          tempSender!,
          tempUser,
          tempChannel!,
          dto.content,
        );
    });
    clientSocket
      .to(tempChannel!.name)
      .except(await this.userService.getArrayBlockedFrom(tempSender!))
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

    this.logger.log(
      `any joiner in the  chat ?${tempUser}  pass = ${joinInfo.password}`,
    );
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
    if (this.channelManagerService.isBanned(tempUser, tempChan)) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.YOU_ARE_BANNED,
      );
    }
    const feedback = await this.channelManagerService.joinChan(
      tempUser,
      tempChan,
      joinInfo.password,
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
    this.logger.debug(
      `active history = ${JSON.stringify(
        await this.userService.getUserHistory(clientSocket),
      )}`,
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
    if (target.id === sender.id) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.YOU_CANT_BE_YOUR_OWN_FRIEND,
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
      this.logger.debug(
        '::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
      );
      this.userService.leaveChannel(tempTarget, tempChan);
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

  async handleDeleteChannel(socket: Socket, deleteInfo: DeleteChannelToServer) {
    const sender = this.userService.findOneActiveBySocket(socket);
    if (!sender)
      return { success: false, errorMessage: ChatError.U_DO_NOT_EXIST };
    const channel = await this.channelManagerService.findChanByName(
      deleteInfo.channel,
    );
    if (!channel)
      return { success: false, errorMessage: ChatError.CHANNEL_NOT_FOUND };
    if (!this.channelManagerService.isCreator(sender, channel))
      return { success: false, errorMessage: ChatError.INSUFICIENT_PERMISSION };
    channel.member.forEach((member) => {
      const tempUser = this.userService.findOneActive(member);
      if (tempUser) this.channelManagerService.leaveChannel(channel, tempUser);
    });
    this.channelManagerService.deleteChannel(channel);
    return { success: true };
  }
  async handleGetChannelInfo(
    socket: Socket,
    chatInfo: GetChannelInfoToServer,
  ): Promise<RequestFeedbackDto<ChannelInfo>> {
    const user = this.userService.findOneActiveBySocket(socket);
    if (!user) {
      return {
        success: false,
        errorMessage: ChatError.USER_NOT_FOUND,
      };
    }
    const channel = await this.channelManagerService.findChanByName(
      chatInfo.channel,
    );
    if (!channel) {
      return {
        success: false,
        errorMessage: ChatError.CHANNEL_NOT_FOUND,
      };
    }
    //let users : ChannelUser[] = [];
    const usersPromise = channel.member.map(async (member) => {
      const tempUser = await this.userService.findOneDb(member);
      if (tempUser) {
        this.logger.debug(
          `ta mere dans channel info ${JSON.stringify(
            this.channelManagerService.ChannelUserTransformator(
              tempUser,
              channel,
            ),
          )}`,
        );
        return this.channelManagerService.ChannelUserTransformator(
          tempUser,
          channel,
        );
      }
      return null;
    });
    const users = await Promise.all(usersPromise);
    const result = users.filter((user) => user !== null) as ChannelUser[];
    this.logger.debug(`end channel info${JSON.stringify(result)}`);
    return {
      success: true,
      result: new ChannelInfo(
        result,
        channel.banned.map((banned) => {
          return banned.userId;
        }),
        channel.category,
      ),
    };
  }
}
