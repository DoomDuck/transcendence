import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { ChatFeedbackDto } from './../chat/chatFeedback.dto';
import { UserHistoryDto } from './userHistory.dto';
import { ChatMessageDto } from './userHistory.dto';
import { ActiveConversationDto } from './userHistory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../channelManager/channelManager.service';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { Repository } from 'typeorm';
import { DatabaseFilesService } from './databaseFile.service';
import { Id } from '../customType';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
import { ChatEvent } from 'chat';
import { ChatError } from 'chat';
import { ServerToClientEvents, ClientToServerEvents } from 'chat';

type Socket = IOSocketBaseType<ClientToServerEvents, ServerToClientEvents>;
type Server = IOServerBaseType<ClientToServerEvents, ServerToClientEvents>;

export class ActiveUser {
  constructor(public id: Id, public name: string, newSocket?: Socket) {
    this.pending_invite = false;
    this.ingame = false;
    this.socketUser = [];
    this.joinedChannel = [];
    this.activeUserConversation = [];
    this.activeChannelConversation = [];
    if (newSocket) this.socketUser.push(newSocket);
  }
  pending_invite: boolean;
  ingame: boolean;
  socketUser: Socket[];
  joinedChannel: Channel[];
  activeUserConversation: ActiveConversation[];
  activeChannelConversation: ActiveConversation[];
}
export class ChatMessage {
  constructor(public sender: Id, public content: string, public isMe: boolean) {
    this.sender = sender;
    this.content = content;
  }
}

export class ActiveConversation {
  constructor(public id: Id, public chatMessage?: ChatMessage) {
    this.id = id;
    this.history = [];
    if (chatMessage) this.history.push(chatMessage);
  }
  history: ChatMessage[];
}

@Injectable()
export class UserService {
  arrayActiveUser: ActiveUser[];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly databaseFilesService: DatabaseFilesService,
    private readonly channelManagerService: ChannelManagerService,
  ) {
    this.arrayActiveUser = [];
  }
  dtoTraductionChatMessage(chatMessage: ChatMessage[]): ChatMessageDto[] {
    let chatMessageDto: ChatMessageDto[];
    chatMessageDto = [];
	//TRES IMPORTANT A SWITCH DE ACTIVE A DATABASE
    chatMessage.forEach((message) =>
      chatMessageDto.push(
        new ChatMessageDto(
          (this.findOneActive(message.sender) as ActiveUser).name,
          message.content,
          message.isMe,
        ),
      ),
    );
    return chatMessageDto;
  }
	// might be deprecated
  // msgToChanVerif(senderId: Id, channel: Channel): boolean {
    // const tempUser = this.findOneActive(senderId);
    // if (channel.member.find((id) => id === senderId)) return true;
    // else return false;
  // }
  dtoTraductionChannelConv(
    activeConversation: ActiveConversation[],
  ): ActiveConversationDto[] {
    let activeConversationDto: ActiveConversationDto[];
    activeConversationDto = [];
    activeConversation.forEach((conv: ActiveConversation) =>
      activeConversationDto.push(
        new ActiveConversationDto(
          (this.channelManagerService.findChanById(conv.id) as Channel).name,
          this.dtoTraductionChatMessage(conv.history),
        ),
      ),
    );
    return activeConversationDto;
  }
  dtoTraductionUserConv(
    activeConversation: ActiveConversation[],
  ): ActiveConversationDto[] {
    let activeConversationDto: ActiveConversationDto[];
    activeConversationDto = [];
    activeConversation.forEach((conv: ActiveConversation) =>
      activeConversationDto.push(
        new ActiveConversationDto(
          (this.findOneActive(conv.id) as ActiveUser).name,
          this.dtoTraductionChatMessage(conv.history),
        ),
      ),
    );
    return activeConversationDto;
  }
  getUserHistory(id: Id): UserHistoryDto | null {
    const tempUser = this.arrayActiveUser.find((user) => user.id === id);
    if (tempUser) {
      return new UserHistoryDto(
        this.dtoTraductionUserConv(tempUser.activeUserConversation),
        this.dtoTraductionChannelConv(tempUser.activeChannelConversation),
      );
    } else {
      return new UserHistoryDto(
        [
          new ActiveConversationDto('gisele', [
            new ChatMessageDto('couillax', 'max', true),
            new ChatMessageDto('gisele', 'lol', false),
          ]),
        ],
        [],
      );
    }
  }
  findAllDb(): Promise<User[]> {
    return this.usersRepository.find();
  }
  findOneActive(id: Id): ActiveUser | undefined {
    return this.arrayActiveUser.find((user) => user.id === id);
  }

  findOneDb(id: Id): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async remove(id: Id): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async addOne(userDto: UserDto): Promise<undefined> {
    const id = userDto.id;
    let logger = new Logger('addone');

    if (!userDto) return;
    if (!userDto.id) return;
    logger.log(userDto);
    logger.log(id);

    logger.log('test1');
    if ((await this.usersRepository.findOneBy({ id })) === null) {
      logger.log('dans undefined');
      const newUser = new User(userDto.id, userDto.name);
      this.usersRepository.save(newUser);
    }
    logger.log(this.usersRepository.findOneBy({ id }));
    const tempUser = this.arrayActiveUser.find((user) => user.id === id);
    if (!tempUser) {
      logger.log('test2');
      this.arrayActiveUser.push(
        new ActiveUser(id, userDto.name, userDto.socket),
      );
    } else {
      logger.log('test3');
      tempUser.socketUser.push(userDto.socket);
    }
    return undefined;
  }

  addNewSocketUser(userId: Id, newSocket: Socket) {
    const activeUser = this.arrayActiveUser.find((user) => user.id === userId);
    if (activeUser) {
      activeUser.socketUser.push(newSocket);
      activeUser.joinedChannel.forEach((channel: Channel) =>
        newSocket.join(channel.name),
      );
    }
  }

  joinChanUser(userId: Id, channelId: Id) {
    const activeUser = this.arrayActiveUser.find((user) => user.id === userId);
    if (activeUser) {
      const tempChannel = activeUser.joinedChannel.find(
        (channel: Channel) => channel.channelId === channelId,
      );
      if (tempChannel)
        activeUser.socketUser.forEach((socket: Socket) =>
          socket.join(tempChannel.name),
        );
    }
  }

  async addFriend(sender: Id, target: Id): Promise<ChatFeedbackDto> {
    const tempSender = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :sender', { sender })
      .getOne();
    const tempTarget = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :sender', { sender })
      .getOne();
    if (tempSender === null)
      return new ChatFeedbackDto(false, ChatError.U_DO_NOT_EXIST);
    if (tempTarget === null)
      return new ChatFeedbackDto(false, ChatError.USER_NOT_FOUND);
    if (
      tempSender.friendlist.find((friend) => friend === target) === undefined
    ) {
      tempSender.friendlist.push(target);
      return new ChatFeedbackDto(true);
    } else return new ChatFeedbackDto(false, ChatError.ALREADY_FRIEND);
  }
  async addAvatar(
    userId: Id,
    imageBuffer: Buffer,
    filename: string,
  ): Promise<boolean> {
    const avatar = await this.databaseFilesService.uploadDatabaseFile(
      imageBuffer,
      filename,
    );
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
    //A MODIFIER
    return true;
  }
  updateUserConversation(
    sender: ActiveUser,
    target: ActiveUser,
    content: string,
  ) {
    const tempSenderConversation = sender.activeUserConversation.find(
      (conv) => conv.id === target.id,
    );
    const tempTargetConversation = sender.activeUserConversation.find(
      (conv) => conv.id === sender.id,
    );
    if (tempSenderConversation)
      tempSenderConversation.history.push(
        new ChatMessage(sender.id, content, true),
      );
    else
      sender.activeUserConversation.push(
        new ActiveConversation(
          target.id,
          new ChatMessage(sender.id, content, true),
        ),
      );
    if (tempTargetConversation)
      tempTargetConversation.history.push(
        new ChatMessage(sender.id, content, false),
      );
    else
      target.activeUserConversation.push(
        new ActiveConversation(
          sender.id,
          new ChatMessage(sender.id, content, false),
        ),
      );
  }
  updateChannelConversation(
    senderId: Id,
    userId: Id,
    channel: Channel,
    content: string,
  ) {
    const sender = this.findOneActive(senderId);
    const user = this.findOneActive(userId);
    if (sender === undefined || user === undefined) return;
    const tempUserConversation = user.activeChannelConversation.find(
      (conv) => conv.id === channel.channelId,
    );
    if (tempUserConversation)
      tempUserConversation.history.push(
        new ChatMessage(sender.id, content, senderId === userId),
      );
    else
      user.activeChannelConversation.push(
        new ActiveConversation(
          channel.channelId,
          new ChatMessage(sender.id, content, senderId === userId),
        ),
      );
  }

  disconnection(clientSocket: Socket) {
    const activeUser = this.findOneActive(clientSocket.handshake.auth.token);
    if (activeUser) {
      if (activeUser.socketUser.length === 1) {
        activeUser.joinedChannel.forEach((channel) =>
          this.channelManagerService.leaveChannel(channel, activeUser.id),
        );
        this.arrayActiveUser = this.arrayActiveUser.slice(
          this.arrayActiveUser.indexOf(activeUser),
          1,
        );
      }
      activeUser.socketUser = activeUser.socketUser.slice(
        activeUser.socketUser.indexOf(clientSocket),
        1,
      );
    }
  }
  leaveChannel(activeUser: ActiveUser, channel: Channel): ChatFeedbackDto {
    if (channel.member.find((id) => id === activeUser.id) === undefined)
      return new ChatFeedbackDto(false, ChatError.NOT_IN_CHANNEL);
    this.channelManagerService.leaveChannel(channel, activeUser.id);
    activeUser.socketUser.forEach((socket) => socket.leave(channel.name));
    return new ChatFeedbackDto(true);
  }
  sendMessageToUser(
    senderId: Id,
    wss: Server,
    content: string,
    target: string,
  ): ChatFeedbackDto {
    let logger = new Logger('sendMessageToUser');
    const tempUserSender = this.arrayActiveUser.find(
      (user) => user.id === senderId,
    );
    const tempUserTarget = this.arrayActiveUser.find(
      (user) => user.name === target,
    );
    if (tempUserSender) {
      if (tempUserTarget) {
        tempUserTarget.socketUser.forEach((socket) =>
          wss.to(socket.id).emit(ChatEvent.MSG_TO_USER, {
            source: tempUserSender.name,
            content: content,
          }),
        );
        this.updateUserConversation(tempUserSender, tempUserTarget, content);
        return new ChatFeedbackDto(true);
      } else return new ChatFeedbackDto(false, ChatError.USER_NOT_FOUND);
    } else return new ChatFeedbackDto(false, ChatError.U_DO_NOT_EXIST);
  }
}
