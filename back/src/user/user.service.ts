import { Injectable, Logger } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { ActiveConversationDto } from './dto/userHistory.dto';
import {
  ActiveChannelConversationDto,
  ActiveUserConversationDto,
  ServerToClientEvents,
} from 'backFrontCommon';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../channelManager/channel.entity';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { Repository } from 'typeorm';
import { DatabaseFilesService } from './databaseFile.service';
import { ServerSocket as Socket, Server } from 'backFrontCommon';
import {
  ChatFeedbackDto,
  UserHistoryDto,
  Id,
  ChatEvent,
  ChatError,
  ChatMessageDto,
} from 'backFrontCommon';
import EventEmitter from 'events';

export class ActiveUser {
  constructor(public id: Id, public name: string, newSocket?: Socket) {
    if (newSocket) this.socketUser.push(newSocket);
  }
  pending_invite = false;
  ingame = false;
  socketUser: Socket[] = [];
  joinedChannel: Channel[] = [];
  activeUserConversation: ActiveConversation[] = [];
  activeChannelConversation: ActiveConversation[] = [];
  eventEmitter: EventEmitter = new EventEmitter();
  emitOnAllSockets<Key extends keyof ServerToClientEvents>(
    event: Key,
    ...args: Parameters<ServerToClientEvents[Key]>
  ) {
    this.socketUser.forEach((socket) => {
      socket.emit(event, ...args);
    });
  }
}
export class ChatMessage {
  constructor(
    public sender: Id,
    public content: string,
    public isMe: boolean,
  ) {}
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
  arrayActiveUser: ActiveUser[] = [];

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly databaseFilesService: DatabaseFilesService,
    private readonly channelManagerService: ChannelManagerService,
  ) {}
  dtoTraductionChatMessage(chatMessage: ChatMessage[]): ChatMessageDto[] {
    const chatMessageDto: ChatMessageDto[] = [];
    //TRES IMPORTANT A SWITCH DE ACTIVE A DATABASE
    chatMessage.forEach((message) =>
      chatMessageDto.push(
        this.channelManagerService.newChatMessageDto(
          (this.findOneActive(message.sender) as ActiveUser).id,
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
  ): ActiveChannelConversationDto[] {
    const activeConversationDto: ActiveChannelConversationDto[] = [];
    activeConversation.forEach((conv: ActiveConversation) =>
      activeConversationDto.push(
        this.channelManagerService.newActiveChannelConversationDto(
          conv.name as string,
          this.dtoTraductionChatMessage(conv.history),
        ),
      ),
    );
    return activeConversationDto;
  }
  dtoTraductionUserConv(
    activeConversation: ActiveConversation[],
  ): ActiveUserConversationDto[] {
    const activeConversationDto: ActiveUserConversationDto[] = [];
    activeConversation.forEach((conv: ActiveConversation) =>
      activeConversationDto.push(
        this.channelManagerService.newActiveUserConversationDto(
          conv.name as number,
          this.dtoTraductionChatMessage(conv.history),
        ),
      ),
    );
    return activeConversationDto;
  }
  getUserHistory(id: Id): UserHistoryDto | null {
    const tempUser = this.arrayActiveUser.find((user) => user.id === id);
    if (tempUser) {
      return this.channelManagerService.newUserHistoryDto(
        this.dtoTraductionUserConv(tempUser.activeUserConversation),
        this.dtoTraductionChannelConv(tempUser.activeChannelConversation),
      );
    } else {
      return this.channelManagerService.newUserHistoryDto(
        [
          this.channelManagerService.newActiveUserConversationDto(4, [
            this.channelManagerService.newChatMessageDto(1, 'max', true),
            this.channelManagerService.newChatMessageDto(4, 'lol', false),
          ]),
        ],
        [],
      );
    }
  }
  findAllDb(): Promise<User[]> {
    return this.usersRepository.find();
  }
  getSocketListStringFromId(activeId: Id): string[] {
    const activeUser = this.findOneActive(activeId);
    if (!activeUser) return [];
    const result: string[] = [];
    activeUser.socketUser.forEach((socket) => result.push(socket.id));
    return result;
  }
  findOneActive(id: Id): ActiveUser | undefined {
    return this.arrayActiveUser.find((user) => user.id == id);
  }
  findOneActiveBySocket(clientSocket: Socket): ActiveUser | undefined {
    return this.arrayActiveUser.find(
      (user) =>
        user.socketUser.find((socket) => socket === clientSocket) != undefined,
    );
  }
  async getArrayBlockedFrom(activeUser: ActiveUser): Promise<string[]> {
    const userDb = await this.findOneDb(activeUser.id);
    if (!userDb) return [];
    let result: string[] = [];
    userDb.blockedFrom.forEach(
      (blocked) =>
        (result = result.concat(this.getSocketListStringFromId(blocked))),
    );
    return result;
  }

  findOneActiveByName(name: string): ActiveUser | undefined {
    return this.arrayActiveUser.find((user) => user.name === name);
  }
  findOneDb(id: Id): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async findOneDbBySocket(clientSocket: Socket): Promise<User | null> {
    const tempUser = this.findOneActiveBySocket(clientSocket);
    if (!tempUser) return null;
    return this.usersRepository.findOneBy({ id: tempUser.id });
  }
  findOneDbByName(name: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ name });
  }
  async remove(id: Id): Promise<void> {
    await this.usersRepository.delete(id);
  }
  async isBlocked(
    activeUser: ActiveUser,
    blockedUser: ActiveUser,
  ): Promise<boolean> {
    const tempUserDb = await this.findOneDb(activeUser.id);
    if (tempUserDb!.blocked.find((blocked) => blocked === blockedUser.id))
      return true;
    else return false;
  }

  async addOne(userDto: UserDto): Promise<void> {
    const id = userDto.id;
    const logger = new Logger('addone');

    logger.log(`userDto = ${userDto.id}`);
    logger.log(id);
    let i = 0;
    let UserDb = await this.findOneDb(id);
    if (UserDb === null) {
      while (await this.findOneDbByName(userDto.name)) {
        i++;
        userDto.name = userDto.name + i;
      }
      UserDb = await this.usersRepository.save(
        new User(userDto.id, userDto.name),
      );
    }
    logger.log(UserDb.name);
    const tempUser = this.arrayActiveUser.find((user) => user.id === id);
    if (!tempUser) {
      this.arrayActiveUser.push(
        new ActiveUser(UserDb.id, userDto.name, userDto.socket),
      );
    } else {
      tempUser.socketUser.push(userDto.socket);
    }
    logger.log('end add one user');
  }

  async addOneGuest(socket: Socket) {
    // TODO: Better guests than random id
    const id = Math.floor(Math.random() * 1000);
    await this.addOne(new UserDto(id, `guest-${id}`, socket));
  }

  addNewSocketUser(activeUser: ActiveUser, newSocket: Socket) {
    if (activeUser) {
      activeUser.socketUser.push(newSocket);
      activeUser.joinedChannel.forEach((channel: Channel) =>
        newSocket.join(channel.name),
      );
    }
  }

  async joinChanUser(activeUser: ActiveUser, channel: Channel) {
    const logger = new Logger('joinChanUser');

    logger.log('ici');
    logger.log(activeUser.id);
    const dbUser = await this.findOneDb(activeUser.id);
    if (dbUser === null) return;
    dbUser.channel.push(channel.name);
    this.usersRepository.update(dbUser!.id, { channel: dbUser.channel });

    if (activeUser) {
      logger.log(
        `la active name = ${activeUser.name} channel name = ${channel.name}`,
      );
      logger.log(activeUser.socketUser);
      activeUser.socketUser.forEach((socket: Socket) =>
        socket.join(channel.name),
      );
    }
  }

  async addFriend(sender: User, target: User): Promise<ChatFeedbackDto> {
    if (
      sender.friendlist.find((friend) => friend === target.id) === undefined
    ) {
      sender.friendlist.push(target.id);
      //a test
      this.usersRepository.update(sender.id, {
        friendlist: sender.friendlist,
      });
      return this.channelManagerService.newChatFeedbackDto(true);
    } else
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.ALREADY_FRIEND,
      );
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
    sender: ActiveUser,
    user: ActiveUser,
    channel: Channel,
    content: string,
  ) {
    // This shouldn't be tested as undefined should not be a possible value
    if (sender === undefined || user === undefined) return;
    const tempUserConversation = user.activeChannelConversation.find(
      (conv) => conv.name === channel.name,
    );
    if (tempUserConversation)
      tempUserConversation.history.push(
        new ChatMessage(sender.id, content, sender === user),
      );
    else
      user.activeChannelConversation.push(
        new ActiveConversation(
          channel.name,
          new ChatMessage(sender.id, content, sender === user),
        ),
      );
  }

  // Update user totpSecret (to enable or disable it)
  async updateTotp(user: User, totpSecret: string | null) {
    await this.usersRepository.update({ id: user.id }, { totpSecret });
  }

  disconnection(clientSocket: Socket) {
    const activeUser = this.findOneActiveBySocket(clientSocket);
    if (activeUser) {
      if (activeUser.socketUser.length === 1) {
        activeUser.joinedChannel.forEach((channel) =>
          this.channelManagerService.leaveChannel(channel, activeUser),
        );
        this.arrayActiveUser = this.arrayActiveUser.slice(
          this.arrayActiveUser.indexOf(activeUser),
          1,
        );
        activeUser.eventEmitter.emit('disconnect');
      } else {
        activeUser.socketUser = activeUser.socketUser.slice(
          activeUser.socketUser.indexOf(clientSocket),
          1,
        );
      }
    }
  }

  leaveChannel(activeUser: ActiveUser, channel: Channel): ChatFeedbackDto {
    if (channel.member.find((id) => id === activeUser.id) === undefined)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.NOT_IN_CHANNEL,
      );
    this.channelManagerService.leaveChannel(channel, activeUser);
    activeUser.socketUser.forEach((socket) => socket.leave(channel.name));
    return this.channelManagerService.newChatFeedbackDto(true);
  }
  async sendMessageToUser(
    sender: ActiveUser,
    wss: Server,
    content: string,
    target: ActiveUser,
  ): Promise<ChatFeedbackDto> {
    if (await this.isBlocked(sender, target)) {
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.YOU_ARE_BLOCKED,
      );
    }
    target.socketUser.forEach((socket) =>
      wss.to(socket.id).emit(ChatEvent.MSG_TO_USER, {
        source: sender.id,
        content: content,
      }),
    );
    this.updateUserConversation(sender, target, content);
    return this.channelManagerService.newChatFeedbackDto(true);
  }

  blockUser(sender: User, target: User): ChatFeedbackDto {
    if (sender.blocked.find((user) => user === target.id) === undefined)
      return this.channelManagerService.newChatFeedbackDto(
        false,
        ChatError.ALREADY_BLOCKED,
      );
    else {
      sender.blocked.push(target.id);
      target.blockedFrom.push(sender.id);
      this.usersRepository.update(sender.id, { blocked: sender.blocked });
      this.usersRepository.update(target.id, {
        blockedFrom: target.blockedFrom,
      });
      return this.channelManagerService.newChatFeedbackDto(true);
    }
  }
}
