import { Injectable } from '@nestjs/common';
import { Id } from '../customType';
import { ChannelDto } from './channel.dto';
import { ChatEvent } from 'chat';
import { ChatError } from 'chat';
import { ChatFeedbackDto } from '../chat/chatFeedback.dto';
import { Server as IOServerBaseType } from 'socket.io';

import { ServerToClientEvents, ClientToServerEvents } from 'chat';

type Server = IOServerBaseType<ClientToServerEvents, ServerToClientEvents>;

export class Channel {
  constructor(
    public channelId: Id,
    public name: string,
    public priv: boolean,
    public protect: boolean,
    public password: string,
    public creator: Id,
  ) {
    this.name = name;
    this.priv = priv;
    this.protect = protect;
    this.password = password;
    this.admin = [];
    this.member = [];
    this.admin.push(creator);
    this.member.push(creator);
    this.creator = creator;
  }

  // To be determinde later
  // banned: idnumber[];
  member: Id[];
  admin: Id[];
}
@Injectable()
export class ChannelManagerService {
  private arrayChannel: Channel[];
  constructor() {
    this.arrayChannel = [];
  }

  createChan(channelDto: ChannelDto): ChatFeedbackDto {
    const found = this.arrayChannel.find(
      (channel) => channel.name === channelDto.name,
    );
    if (found === undefined) {
      this.arrayChannel.push(
        new Channel(
          this.arrayChannel.length + 1,
          channelDto.name,
          channelDto.priv,
          channelDto.protec,
          channelDto.password,
          channelDto.creator,
        ),
      );
      return new ChatFeedbackDto(true);
    } else return new ChatFeedbackDto(false, ChatError.NAME_ALREADY_IN_USE);
  }

  findChanByName(chanName: string): Channel | string {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );
    if (tempChan === undefined) return 'channel not found';
    else return tempChan;
  }
  findChanById(channelId: Id): Channel | false {
    const tempChan = this.arrayChannel.find(
      (channel) => channel.channelId === channelId,
    );
    if (tempChan === undefined) return false;
    else return tempChan;
  }
  findChanAll(): Channel[] | string {
    if (this.arrayChannel === []) return 'no channel at all';
    else return this.arrayChannel;
  }
  //Return string is placeholder
  joinChan(sender: Id, channelId: Id, password?: string): ChatFeedbackDto {
    const tempChan = this.arrayChannel.find(
      (element) => element.channelId === channelId,
    );
    if (tempChan === undefined)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);

    if (tempChan.member.find((element) => element === sender))
      return new ChatFeedbackDto(false, ChatError.ALREADY_IN_CHANNEL);
    if (tempChan.priv)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_IS_PRIVATE);

    if (tempChan.protect) {
      if (password != tempChan.password)
        return new ChatFeedbackDto(false, ChatError.WRONG_PASSWORD);
    }
    tempChan.member.push(sender);
    return new ChatFeedbackDto(true);
  }
  setPrivate(sender: Id, chanName: string): ChatFeedbackDto {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );
    if (tempChan === undefined)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    tempChan.priv = true;
    return new ChatFeedbackDto(true);
  }
  msgToChanVerif(senderId: Id, channel: Channel) {}
  setPassword(sender: Id, chanName: string, password: string): ChatFeedbackDto {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );

    if (tempChan === undefined)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    tempChan.protect = true;
    tempChan.password = password;
    return new ChatFeedbackDto(true);
  }
  setNewAdmin(sender: Id, target: Id, chanName: string): ChatFeedbackDto {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );
    if (tempChan === undefined)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    if (tempChan.admin.find((element) => element === target) != undefined)
      return new ChatFeedbackDto(false, ChatError.ALREADY_ADMIN);
    tempChan.admin.push(target);
    return new ChatFeedbackDto(true);
  }
  getRoomName(channelId: Id): string | undefined {
    const tempChan = this.arrayChannel.find(
      (element) => element.channelId === channelId,
    );

    if (tempChan) {
      return tempChan.name;
    }
    return undefined;
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
