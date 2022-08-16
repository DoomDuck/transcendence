import { Injectable } from '@nestjs/common';
import { Id } from 'backFrontCommon';
import { ChannelDto } from './channel.dto';
import { ChatEvent } from 'backFrontCommon';
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
  ChatMessageDto,
  ActiveUserConversationDto,
  ActiveChannelConversationDto,
  UserHistoryDto,
} from 'backFrontCommon';
import { ServerToClientEvents, ClientToServerEvents } from 'backFrontCommon';
import { Channel } from './channel.entity';
type Server = IOServerBaseType<ClientToServerEvents, ServerToClientEvents>;
//
// export class Channel {
// constructor(
// public channelId: Id,
// public name: string,
// public category : ChannelCategory,
// public password: string,
// public creator: Id,
// ) {
// this.name = name;
// this.password = password;
// this.admin = [];
// this.member = [];
// this.admin.push(creator);
// this.member.push(creator);
// this.creator = creator;
// }
//
// // To be determinde later
// // banned: idnumber[];
// member: Id[];
// admin: Id[];
// }

@Injectable()
export class ChannelManagerService {
  // private arrayChannel: Channel[];
  constructor(
    @InjectRepository(Channel)
    private channelRepository: Repository<Channel>,
  ) {
    // this.arrayChannel = [];
  }
  private logger: Logger = new Logger('channelManagerService');

  createChan(senderId: Id, chanInfo: CreateChannelToServer): Promise<Channel> {
    this.logger.log('createChan');
    this.logger.log(chanInfo.channel);
    return this.channelRepository.save(
      new Channel(
        chanInfo.channel,
        senderId,
        chanInfo.category,
        chanInfo.password,
      ),
    );
    //return new ChatFeedbackDto(true);
  }

  newChatFeedbackDto(_success: boolean, _errorMessage?: string) {
    if (_errorMessage)
      return { success: _success, erorrMessage: _errorMessage };
    else return { success: _success, erorrMessage: undefined };
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
  leaveChannel(channel: Channel, clientId: Id) {
    if (clientId === channel.creator) channel.creator = -1;
    channel.member = channel.member.slice(channel.member.indexOf(clientId), 1);
    channel.admin = channel.admin.slice(channel.admin.indexOf(clientId), 1);
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
    // if (tempChan === null)
    // return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
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
