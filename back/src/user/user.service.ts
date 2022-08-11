import { Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { ChatFeedbackDto } from './../chat/chatFeedback.dto';
import { UserHistoryDto } from './dto/userHistory.dto';
import { ChatMessageDto } from './dto/userHistory.dto';
import { ActiveConversationDto } from './dto/userHistory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../channelManager/channel.entity';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { Repository } from 'typeorm';
import { DatabaseFilesService } from './databaseFile.service';
import { MatchHistoryService } from '../matchHistory/matchHistory.service';
import { Id } from '../customType';
import { ChatEvent } from 'chat';
import { ChatError } from 'chat';
import {
  Socket as IOSocketBaseType,
  Server as IOServerBaseType,
} from 'socket.io';
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
  constructor(public name: string | Id, public chatMessage?: ChatMessage) {
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
    private readonly matchHistoryService: MatchHistoryService,
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
  getLeaderboard(): Promise<User[]> {
    return this.usersRepository.find({
      order: {
        score: 'ASC', // "DESC"
      },
    });
  }
  dtoTraductionChannelConv(
    activeConversation: ActiveConversation[],
  ): ActiveConversationDto[] {
    let activeConversationDto: ActiveConversationDto[];
    activeConversationDto = [];
    activeConversation.forEach((conv: ActiveConversation) =>
      activeConversationDto.push(
        new ActiveConversationDto(
          // ( await this.channelManagerService.findChanByName(conv.name) as Channel).name,
          conv.name as string,
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
          (this.findOneActive(conv.name as number) as ActiveUser).name,
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
    return this.arrayActiveUser.find((user) => user.id == id);
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
    // if (!userDto) return;
    // if (!userDto.id) return;
    logger.log(`userDto = ${userDto.id}`);
    logger.log(id);

    let UserDb = await this.usersRepository.findOneBy({ id });
    logger.log('test1');
    if (UserDb === null) {
      logger.log('dans undefined');
      const newUser = new User(userDto.id, userDto.name);
      UserDb = await this.usersRepository.save(newUser);
      logger.log('after new user db');
    }
    logger.log(UserDb.name);
    const tempUser = this.arrayActiveUser.find((user) => user.id === id);
    if (!tempUser) {
      logger.log('test2');
      this.arrayActiveUser.push(
        new ActiveUser(UserDb.id, userDto.name, userDto.socket),
      );
    } else {
      logger.log('test3');
      tempUser.socketUser.push(userDto.socket);
    }
    logger.log('end add one user');
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

  async joinChanUser(activeUser: ActiveUser, channel: Channel) {
    let logger = new Logger('joinChanUser');

    logger.log('ici');
    logger.log(activeUser.id);
    const dbUser = await this.findOneDb(activeUser.id);
    if (dbUser === null) return;
    dbUser.channel.push(channel.name);
    this.usersRepository.update(dbUser!.id, { channel: dbUser.channel });

    logger.log('la');
    if (activeUser) {
      logger.log(activeUser.name);
      logger.log(activeUser.socketUser);
      activeUser.socketUser.forEach((socket: Socket) =>
        socket.join(channel.name),
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
      .where('User.id = :target', { target })
      .getOne();
    if (tempSender === null)
      return new ChatFeedbackDto(false, ChatError.U_DO_NOT_EXIST);
    if (tempTarget === null)
      return new ChatFeedbackDto(false, ChatError.USER_NOT_FOUND);
    if (
      tempSender.friendlist.find((friend) => friend === target) === undefined
    ) {
      tempSender.friendlist.push(target);
      //a test
      this.usersRepository.update(tempSender.id, {
        friendlist: tempSender.friendlist,
      });
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
      (conv) => conv.name === target.id,
    );
    const tempTargetConversation = sender.activeUserConversation.find(
      (conv) => conv.name === sender.id,
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
      (conv) => conv.name === channel.name,
    );
    if (tempUserConversation)
      tempUserConversation.history.push(
        new ChatMessage(sender.id, content, senderId === userId),
      );
    else
      user.activeChannelConversation.push(
        new ActiveConversation(
          channel.name,
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
