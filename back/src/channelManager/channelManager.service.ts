import { Injectable } from '@nestjs/common';
import { Id } from '../customType';
import { ChannelDto } from './channel.dto';
import { Socket, Server } from 'socket.io';
import { ChatEvent } from 'chat';
import { ChatError } from 'chat';
import { ChatFeedbackDto } from '../chat/chatFeedback.dto';

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

  createChan(channelDto: ChannelDto): boolean {
    const found = this.arrayChannel.find(
      (channel) => channel.name === channelDto.name,
    );
    if (found === undefined) {
      if (this.arrayChannel === [])
        this.arrayChannel.push(
          new Channel(
            1,
            channelDto.name,
            channelDto.priv,
            channelDto.protec,
            channelDto.password,
            channelDto.creator,
          ),
        );
      else {
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
      }
      return true;
    } else return false;
  }
  findChanOne(chanName: string): Channel | string {
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
  setPrivate(sender: Id, chanName: string): string {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );
    if (tempChan === undefined) return "chan doesn't exist";
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return 'insuficient permission';
    tempChan.priv = true;
    return 'private mode set';
  }

  setPassword(sender: Id, chanName: string, password: string): string {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );

    if (tempChan === undefined) return "chan doesn't exist";
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return 'insuficient permission';
    tempChan.protect = true;
    tempChan.password = password;
    return 'password set';
  }
  setNewAdmin(sender: Id, target: Id, chanName: string): string {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );
    if (tempChan === undefined) return "chan doesn't exist";
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return 'insuficient permission';
    if (tempChan.admin.find((element) => element === target) != undefined)
      return 'target already admin';
    tempChan.admin.push(target);
    return 'new admin added ';
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
  sendMessageToChannel(
    wss: Server,
    messageInfo: { sender: Id; text: string; channelId: Id },
  ) {
    const tempChan = this.arrayChannel.find(
      (channel) => channel.channelId == messageInfo.channelId,
    );
    if (tempChan) {
      if (
        tempChan.member.find((member) => member === messageInfo.sender) !=
        undefined
      )
        wss.to(tempChan.name).emit(ChatEvent.MSG_TO_CHANNEL, messageInfo);
    }
  }
}
