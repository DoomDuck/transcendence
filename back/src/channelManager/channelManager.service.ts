import { Injectable } from '@nestjs/common';
import { Id } from '../customType';
import { ChannelDto } from './channel.dto';
import { ChatEvent } from 'chat';
import { ActiveUser } from '../user/user.service';
import { ChatError } from 'chat';
import { ChatFeedbackDto } from '../chat/chatFeedback.dto';
import  {ChannelCategory} from 'chat';
import { Server as IOServerBaseType } from 'socket.io';
import type { CreateChannelToServer } from 'chat';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServerToClientEvents, ClientToServerEvents } from 'chat';
import {Channel} from './channel.entity'
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
  constructor(@InjectRepository(Channel)
    private channelRepository: Repository<Channel>) {
    // this.arrayChannel = [];
  }

  createChan(senderId:Id,chanInfo: CreateChannelToServer): ChatFeedbackDto {
      this.channelRepository.save(new Channel(chanInfo.channel, senderId,chanInfo.category, chanInfo.password
	  ));
	return new ChatFeedbackDto(true);
  }

  leaveChannel(channel: Channel, clientId: Id) {
    if (clientId === channel.creator) channel.creator = -1;
    channel.member = channel.member.slice(channel.member.indexOf(clientId), 1);
    channel.admin = channel.admin.slice(channel.admin.indexOf(clientId), 1);
  }
  findChanByName(name: string): Promise<Channel | null >{
    return this.channelRepository.findOneBy({ name });
	  // const tempChan = this.arrayChannel.find(
      // (element) => element.name === chanName,
    // );
    // if (tempChan === undefined) return undefined;
    // else return tempChan;
  }
  findChanById(id: Id): Promise<Channel | null> {
    return this.channelRepository.findOneBy({ id });
    // const tempChan = this.arrayChannel.find(
      // (channel) => channel.channelId === channelId,
    // );
    // if (tempChan === undefined) return undefined;
    // else return tempChan;
  }
  findChanAll(): Promise<Channel[]>   {
    return this.channelRepository.find();
    // if (this.arrayChannel === []) return 'no channel at all';
    // else return this.arrayChannel;
  }
  //Return string is placeholder
  async joinChan(sender: Id, name: string, password?: string): Promise<ChatFeedbackDto >{

    const tempChan= await this.channelRepository.findOneBy({ name });

    if (!tempChan )
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);

    if (tempChan.member.find((element) => element === sender))
      return new ChatFeedbackDto(false, ChatError.ALREADY_IN_CHANNEL);
    if (tempChan.category === ChannelCategory.PRIVATE)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_IS_PRIVATE);

    if (tempChan.category === ChannelCategory.PROTECTED) {
      if (!password || password != tempChan.password)
        return new ChatFeedbackDto(false, ChatError.WRONG_PASSWORD);
    }
    tempChan.member.push(sender);
	this.channelRepository.update(tempChan.name!,{member :tempChan.member})
    return new ChatFeedbackDto(true);
  }
  async setPrivate(sender: Id, name: string): Promise<ChatFeedbackDto> {

    const tempChan= await this.channelRepository.findOneBy({ name });
    if (tempChan === null)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
	this.channelRepository.update(tempChan.name!,{category :ChannelCategory.PRIVATE})
    return new ChatFeedbackDto(true);
  }
  async setPassword(sender: Id, name: string, password: string):Promise<ChatFeedbackDto>  {

    const tempChan= await this.channelRepository.findOneBy({ name });
    if (tempChan === null)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);

	this.channelRepository.update(tempChan.name!,{category :ChannelCategory.PROTECTED})
	this.channelRepository.update(tempChan.name!,{password :password})
    return new ChatFeedbackDto(true);
  }
  async setNewAdmin(sender: Id, target: Id, name: string): Promise<ChatFeedbackDto> {
    const tempChan= await this.channelRepository.findOneBy({ name });
    
    if (tempChan === null)
      return new ChatFeedbackDto(false, ChatError.CHANNEL_NOT_FOUND);
    if (tempChan.admin.find((element) => element === sender) === undefined)
      return new ChatFeedbackDto(false, ChatError.INSUFICIENT_PERMISSION);
    if (tempChan.admin.find((element) => element === target) != undefined)
      return new ChatFeedbackDto(false, ChatError.ALREADY_ADMIN);
    tempChan.admin.push(target);
	this.channelRepository.update(tempChan.name!,{admin :tempChan.admin})
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
