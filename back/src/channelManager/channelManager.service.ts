import { Injectable } from '@nestjs/common';
import { Id } from '../customType';
import { ChannelDto } from './channel.dto';
import { ChatEvent } from 'chat';
import { ActiveUser } from '../user/user.service';
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

  leaveChannel(channel:Channel, clientId:Id)
  {
	  	if(clientId===channel.creator)
			channel.creator = -1;
		channel.member = channel.member.slice(channel.member.indexOf(clientId),1);
		channel.admin = channel.admin.slice(channel.admin.indexOf(clientId),1);
  }
  findChanByName(chanName: string): Channel | undefined {
    const tempChan = this.arrayChannel.find(
      (element) => element.name === chanName,
    );
    if (tempChan === undefined) return undefined;
    else return tempChan;
  }
  findChanById(channelId: Id): Channel | undefined {
    const tempChan = this.arrayChannel.find(
      (channel) => channel.channelId === channelId,
    );
    if (tempChan === undefined) return undefined;
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

	msgToChannelVerif(channel:Channel | undefined, sender: ActiveUser | undefined):ChatFeedbackDto | true
	{
	if (!channel)
	  return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
	if (!sender)
	  return new ChatFeedbackDto(false, ChatError.U_DO_NOT_EXIST);
    if (!channel.member.find((id) => id === sender.id))
	  return new ChatFeedbackDto(false, ChatError.NOT_IN_CHANNEL);

  	return true
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
