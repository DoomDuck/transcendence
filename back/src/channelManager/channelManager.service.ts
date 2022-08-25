import { Injectable } from '@nestjs/common';
import { Id } from 'backFrontCommon';
import { ChannelDto } from './channel.dto';
import { ChatEvent } from 'backFrontCommon';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { ActiveUser } from '../user/user.service';
import { ChatError } from 'backFrontCommon';
import { ChatFeedbackDto } from '../chat/chatFeedback.dto';
import { ChannelCategory } from 'backFrontCommon';
import * as bcrypt from 'bcrypt';
import { Server as IOServerBaseType } from 'socket.io';
import type { CreateChannelToServer } from 'backFrontCommon';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  BanUserFromServer,
  ChatMessageDto,
  ActiveUserConversationDto,
  ActiveChannelConversationDto,
  UserHistoryDto,
} from 'backFrontCommon';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
import { Channel } from './channel.entity';
type Server = IOServerBaseType<ClientToServerEvents, ServerToClientEvents>;

@Injectable()
export class ChannelManagerService {
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {}
  private logger: Logger = new Logger('channelManagerService');

  isCreator(user: ActiveUser, channel: Channel): boolean {
    if (channel.creator === user.id) return true;
    else return false;
  }

  isAdmin(user: ActiveUser, channel: Channel): boolean {
    if (channel.admin.find((users) => user.id === users) != undefined)
      return true;
    else return false;
  }
  isBanned(user: ActiveUser, channel: Channel): boolean {
    if (channel.banned.find((users) => user.id === users) != undefined)
      return true;
    else return false;
  }
  isMember(user: ActiveUser, channel: Channel): boolean {
    if (channel.member.find((users) => user.id === users) != undefined)
      return true;
    else return false;
  }
  async createChan(
    activeUser: ActiveUser,
    chanInfo: CreateChannelToServer,
  ): Promise<Channel> {
    this.logger.log('createChan');
    this.logger.log(chanInfo.channel);
    if (chanInfo.category === ChannelCategory.PROTECTED)
      return this.channelRepository.save(
        new Channel(
          chanInfo.channel,
          activeUser.id,
          chanInfo.category,
          await bcrypt.hash(chanInfo.password!, 10),
        ),
      );
    else
      return this.channelRepository.save(
        new Channel(chanInfo.channel, activeUser.id, chanInfo.category),
      );
    //return new ChatFeedbackDto(true);
  }

  newChatFeedbackDto(_success: boolean, _errorMessage?: string) {
    if (_errorMessage)
      return { success: _success, errorMessage: _errorMessage };
    else return { success: _success, errorMessage: undefined };
  }
  newChatMessageDto(
    _sender: Id,
    _content: string,
    _isMe: boolean,
  ): ChatMessageDto {
    return { sender: _sender, content: _content, isMe: _isMe };
  }

  newActiveUserConversationDto(
    _interlocutor: Id,
    _history: ChatMessageDto[],
  ): ActiveUserConversationDto {
    return { interlocutor: _interlocutor, history: _history };
  }
  newActiveChannelConversationDto(
    _channel: string,
    _history: ChatMessageDto[],
  ): ActiveChannelConversationDto {
    return { channel: _channel, history: _history };
  }

  newUserHistoryDto(
    _userHistory: ActiveUserConversationDto[],
    _channelHistory: ActiveChannelConversationDto[],
  ):UserHistoryDto {
    return { userHistory: _userHistory, channelHistory: _channelHistory };
  }
  leaveChannel(channel: Channel, user: ActiveUser) {
    if (user.id === channel.creator) channel.creator = -1;
    channel.member = channel.member.slice(channel.member.indexOf(user.id), 1);
    channel.admin = channel.admin.slice(channel.admin.indexOf(user.id), 1);
  }
  async findChanByName(name: string): Promise<Channel | null> {
    return this.channelRepository.findOneBy({ name });
  }

  findChanAll(): Promise<Channel[]> {
    return this.channelRepository.find();
  }
  async joinChan(
    user: ActiveUser,
    channel: Channel,
    password?: string,
  ): Promise<ChatFeedbackDto> {
    if (channel.member.find((element) => element === user.id))
      return new ChatFeedbackDto(false, ChatError.ALREADY_IN_CHANNEL);
    if (channel.category === ChannelCategory.PRIVATE)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_IS_PRIVATE);
    if (channel.category === ChannelCategory.PROTECTED) {
      if (!password || (await bcrypt.compare(password, channel.passHash!)))
        return new ChatFeedbackDto(false, ChatError.WRONG_PASSWORD);
    }
    this.logger.log(`user == ${user.id}added`);
    channel.member.push(user.id);
    this.channelRepository.update(channel.name!, { member: channel.member });
    return new ChatFeedbackDto(true);
  }

  async joinChanPrivate(
    user: ActiveUser,
    channel: Channel,
  ): Promise<ChatFeedbackDto> {
    if (
      channel.member.find((element) => element === user.id) &&
      user.id != channel.creator
    )
      return new ChatFeedbackDto(false, ChatError.ALREADY_IN_CHANNEL);
    channel.member.push(user.id);
    this.channelRepository.update(channel.name!, { member: channel.member });
    return new ChatFeedbackDto(true);
  }
  // MIGHT NO BE NEEDED
  // async setPrivate(sender: Id, name: string): Promise<ChatFeedbackDto> {
  // const tempChan = await this.channelRepository.findOneBy({ name });
  // if (tempChan === null)
  // return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
  // if (tempChan.admin.find((element) => element === sender) === undefined)
  // return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
  // this.channelRepository.update(tempChan.name!, {
  // category: ChannelCategory.PRIVATE,
  // });
  // return new ChatFeedbackDto(true);
  // }
  async setPassword(
    user: ActiveUser,
    channel: Channel,
    password: string,
  ): Promise<ChatFeedbackDto> {
    if (channel.creator != user.id)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);

    this.channelRepository.update(channel.name!, {
      category: ChannelCategory.PROTECTED,
    });
    this.channelRepository.update(channel.name!, {
      passHash: await bcrypt.hash(password, 10),
    });
    return new ChatFeedbackDto(true);
  }
  async setNewAdmin(
    sender: ActiveUser,
    target: ActiveUser,
    channel: Channel,
  ): Promise<ChatFeedbackDto> {
    if (channel.creator != sender.id)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    if (channel.admin.find((element) => element === target.id) != undefined)
      return new ChatFeedbackDto(false, ChatError.ALREADY_ADMIN);
    channel.admin.push(target.id);
    this.channelRepository.update(channel.name!, { admin: channel.admin });
    return new ChatFeedbackDto(true);
  }

  msgToChannelVerif(
    channel: Channel | null,
    sender: ActiveUser | undefined,
  ): ChatFeedbackDto | true {
    if (!channel)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (!sender) return new ChatFeedbackDto(false, ChatError.U_DO_NOT_EXIST);
    if (!channel.member.find((id) => id === sender.id))
      return new ChatFeedbackDto(false, ChatError.NOT_IN_CHANNEL);
    return true;
  }

  banUser(
    sender: ActiveUser,
    target: ActiveUser,
    channel: Channel,
    duration: number,
    wss: Server,
  ): ChatFeedbackDto {
    if (channel.admin.find((admin) => admin === sender.id) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    if (channel.banned.find((banned) => target.id === banned) != undefined)
      return new ChatFeedbackDto(false, ChatError.ALREADY_BANNED);
    else {
      target.socketUser.forEach((socket) =>
        wss.to(socket.id).emit(ChatEvent.BANNED_NOTIF, {
          channel: channel.name,
          sender: sender.id,
          duration: duration,
        }),
      );
      channel.banned.push(target.id);
      this.channelRepository.update(channel.name, { banned: channel.banned });
      setTimeout(this.unBanUser, duration * 1000);
      return new ChatFeedbackDto(true);
    }
  }

  unBanUser(user: User, channel: Channel): ChatFeedbackDto {
    if (channel.banned.find((banned) => user.id === banned) === undefined)
      return new ChatFeedbackDto(false, ChatError.NOT_BANNED);
    else {
      channel.banned = channel.banned.slice(channel.banned.indexOf(user.id), 1);
      this.channelRepository.update(channel.name, { banned: channel.banned });
      return new ChatFeedbackDto(true);
    }
  }
  muteUser(
    sender: ActiveUser,
    target: ActiveUser,
    channel: Channel,
    duration: number,
    wss: Server,
  ): ChatFeedbackDto {
    if (channel.admin.find((admin) => admin === sender.id) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    if (channel.muted.find((muted) => target.id === muted) != undefined)
      return new ChatFeedbackDto(false, ChatError.ALREADY_MUTED);
    else {
      target.socketUser.forEach((socket) =>
        wss.to(socket.id).emit(ChatEvent.MUTED_NOTIF, {
          channel: channel.name,
          sender: sender.id,
          duration: duration,
        }),
      );
      channel.muted.push(target.id);
      this.channelRepository.update(channel.name, { muted: channel.muted });
      setTimeout(this.unMuteUser, duration * 1000);
      return new ChatFeedbackDto(true);
    }
  }
  unMuteUser(user: User, channel: Channel): ChatFeedbackDto {
    if (channel.muted.find((muted) => user.id === muted) === undefined)
      return new ChatFeedbackDto(false, ChatError.NOT_MUTED);
    else {
      channel.muted = channel.muted.slice(channel.muted.indexOf(user.id), 1);
      this.channelRepository.update(channel.name, { muted: channel.muted });
      return new ChatFeedbackDto(true);
    }
  }

  inviteUserToChannel(
    sender: ActiveUser,
    target: ActiveUser,
    channel: Channel,
    wss: Server,
  ): ChatFeedbackDto {
    if (!this.isAdmin(sender, channel))
      return { success: false, errorMessage: ChatError.INSUFICIENT_PERMISSION };
    if (this.isMember(target, channel))
      return { success: false, errorMessage: ChatError.ALREADY_IN_CHANNEL };
    if (this.isBanned(target, channel))
      return { success: false, errorMessage: ChatError.USER_IS_BANNED };
    target.socketUser.forEach((socket) =>
      wss.to(socket.id).emit(ChatEvent.INVITE_TO_PRIVATE_CHANNEL, {
        channel: channel.name,
        source: sender.id,
      }),
    );
    return { success: true };
  }
}
