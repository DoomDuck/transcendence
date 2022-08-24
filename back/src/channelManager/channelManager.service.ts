import { Injectable } from '@nestjs/common';
import { Id, MuteUserFromServer } from 'backFrontCommon';
import { ChatEvent } from 'backFrontCommon';
import { User } from '../user/entities/user.entity';
import { ActiveUser } from '../user/user.service';
import { ChatError } from 'backFrontCommon';
import { ChatFeedbackDto } from '../chat/chatFeedback.dto';
import { ChannelCategory } from 'backFrontCommon';

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

  createChan(
    activeUser: ActiveUser,
    chanInfo: CreateChannelToServer,
  ): Promise<Channel> {
    this.logger.log('createChan');
    this.logger.log(chanInfo.channel);
    return this.channelRepository.save(
      new Channel(
        chanInfo.channel,
        activeUser.id,
        chanInfo.category,
        chanInfo.password,
      ),
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
  ) {
    return { userHistory: _userHistory, channelHistory: _channelHistory };
  }
  leaveChannel(channel: Channel, user: ActiveUser) {
    if (user.id === channel.creator) channel.creator = -1;
    channel.member = channel.member.slice(channel.member.indexOf(user.id), 1);
    channel.admin = channel.admin.slice(channel.admin.indexOf(user.id), 1);
  }
  async findChanByName(name: string): Promise<Channel | null> {
    return this.channelRepository.findOneBy({ name });
    // need changes
    // const entities = await this.channelRepository.find();
    // // entities.forEach((channel)=> console.log(channel.name));
    // const res = entities.find((channel)=> channel.name ===name);
    // if (res)
    // return res ;
    // else
    // return null;
  }

  findChanAll(): Promise<Channel[]> {
    return this.channelRepository.find();
    // if (this.arrayChannel === []) return 'no channel at all';
    // else return this.arrayChannel;
  }
  //Return string is placeholder
  async joinChan(
    user: ActiveUser,
    channel: Channel,
    password?: string,
  ): Promise<ChatFeedbackDto> {
    if (
      channel.member.find((element) => element === user.id) &&
      user.id != channel.creator
    )
      return new ChatFeedbackDto(false, ChatError.ALREADY_IN_CHANNEL);
    if (
      channel.category === ChannelCategory.PRIVATE &&
      user.id != channel.creator
    )
      return new ChatFeedbackDto(false, ChatError.CHANNEL_IS_PRIVATE);
    if (
      channel.category === ChannelCategory.PROTECTED &&
      user.id != channel.creator
    ) {
      if (!password || password != channel.password)
        return new ChatFeedbackDto(false, ChatError.WRONG_PASSWORD);
    }
    this.logger.log(`user == ${user.id}added`);
    channel.member.push(user.id);
    this.channelRepository.update(channel.name!, { member: channel.member });
    return new ChatFeedbackDto(true);
  }
  async setPrivate(sender: Id, name: string): Promise<ChatFeedbackDto> {
    const tempChan = await this.channelRepository.findOneBy({ name });
    if (tempChan === null)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    this.channelRepository.update(tempChan.name!, {
      category: ChannelCategory.PRIVATE,
    });
    return new ChatFeedbackDto(true);
  }
  async setPassword(
    sender: Id,
    name: string,
    password: string,
  ): Promise<ChatFeedbackDto> {
    const tempChan = await this.channelRepository.findOneBy({ name });
    if (tempChan === null)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);

    this.channelRepository.update(tempChan.name!, {
      category: ChannelCategory.PROTECTED,
    });
    this.channelRepository.update(tempChan.name!, { password: password });
    return new ChatFeedbackDto(true);
  }
  async setNewAdmin(
    sender: Id,
    target: Id,
    name: string,
  ): Promise<ChatFeedbackDto> {
    const tempChan = await this.channelRepository.findOneBy({ name });

    if (tempChan === null)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    if (tempChan.admin.find((element) => element === target) != undefined)
      return new ChatFeedbackDto(false, ChatError.ALREADY_ADMIN);
    tempChan.admin.push(target);
    this.channelRepository.update(tempChan.name!, { admin: tempChan.admin });
    return new ChatFeedbackDto(true);
  }
  // getRoomName(channelId: Id): string | undefined {
  // const tempChan = this.arrayChannel.find(
  // (element) => element.channelId === channelId,
  // );
  //
  // if (tempChan) {
  // return tempChan.name;
  // }
  // return undefined;
  // }

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
        wss.to(socket.id).emit(ChatEvent.BANNED_NOTIF, new BanUserFromServer(
          channel.name,
          sender.id,
          duration,
        ))
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
        wss.to(socket.id).emit(ChatEvent.MUTED_NOTIF, new MuteUserFromServer(
          channel.name,
          sender.id,
          duration,
        ))
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

  //Send invitation
  // sendMessageToChannel(
  // wss: Server,
  // text:string,
  // sender: ActiveUser;
  // channel:Channel,
  // ) {
  // channel.member.find((member) => member === messageInfo.sender) !=
  // undefined
  // )
  // }
  // }
}
