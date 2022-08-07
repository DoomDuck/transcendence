import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { UserHistoryDto } from './userHistory.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../channelManager/channelManager.service';
import { Repository } from 'typeorm';
import { DatabaseFilesService } from './databaseFile.service';
import { Id } from '../customType';
import { Socket, Server } from 'socket.io';

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
  constructor(public sender: Id, public content: string) {
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
  ) {
    this.arrayActiveUser = [];
  }
  getUserHistory(id: Id): UserHistoryDto | undefined {
    const tempUser = this.arrayActiveUser.find((user) => user.id === id);
    if (tempUser)
      return new UserHistoryDto(
        tempUser.activeUserConversation,
        tempUser.activeChannelConversation,
      );
    else return undefined;
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
    let logger = new Logger('user');
    logger.log(userDto);
    logger.log(id);
    if ((await this.usersRepository.findOneBy({ id })) === null) {
      logger.log('dans undefined');
      const newUser = new User(userDto.id, userDto.name);
      this.usersRepository.save(newUser);
    }
    logger.log(this.usersRepository.findOneBy({ id }));
    const tempUser = this.arrayActiveUser.find((user) => user.id === id);
    if (!tempUser) {
      this.arrayActiveUser.push(
        new ActiveUser(id, userDto.name, userDto.socket),
      );
    } else {
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
      const newChannel = activeUser.joinedChannel.find(
        (channel: Channel) => channel.channelId === channelId,
      );
      if (newChannel)
        activeUser.socketUser.forEach((socket: Socket) =>
          socket.join(newChannel.name),
        );
    }
  }

  async addFriend(sender: Id, target: Id): Promise<string | User> {
    const tempSender = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :sender', { sender })
      .getOne();
    const tempTarget = await this.usersRepository
      .createQueryBuilder('User')
      .where('User.id = :sender', { sender })
      .getOne();
    if (tempSender === null) return 'Sender does not exist';
    if (tempTarget === null) return 'Target does not exist';
    if (
      tempSender.friendlist.find((friend) => friend === target) === undefined
    ) {
      tempSender.friendlist.push(target);
      return this.usersRepository.save(tempSender);
    } else return 'Already friends';
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
      tempSenderConversation.history.push(new ChatMessage(sender.id, content));
    else
      sender.activeUserConversation.push(
        new ActiveConversation(target.id, new ChatMessage(sender.id, content)),
      );

    if (tempTargetConversation)
      tempTargetConversation.history.push(new ChatMessage(sender.id, content));
    else
      target.activeUserConversation.push(
        new ActiveConversation(sender.id, new ChatMessage(sender.id, content)),
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
      tempUserConversation.history.push(new ChatMessage(sender.id, content));
    else
      user.activeChannelConversation.push(
        new ActiveConversation(
          channel.channelId,
          new ChatMessage(sender.id, content),
        ),
      );
  }
  sendMessageToUser(
    wss: Server,
    messageInfo: { sender: Id; text: string; target: Id },
  ) {
    const tempUserSender = this.arrayActiveUser.find(
      (user) => user.id === messageInfo.sender,
    );
    const tempUserTarget = this.arrayActiveUser.find(
      (user) => user.id === messageInfo.target,
    );
    if (tempUserSender) {
      if (tempUserTarget) {
        tempUserTarget.socketUser.forEach((socket) =>
          wss.to(socket.id).emit('userToUser', messageInfo),
        );
        this.updateUserConversation(
          tempUserSender,
          tempUserTarget,
          messageInfo.text,
        );
      }
    }
  }
}
