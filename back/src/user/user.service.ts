import { Injectable, Logger } from '@nestjs/common';
import { User } from './user.entity';
import { UserDto } from './user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Channel } from '../channelManager/channelManager.service';
import { Repository } from 'typeorm';
import { DatabaseFilesService } from './databaseFile.service';
import { Id } from '../customType';
import { Socket , Server} from 'socket.io';

export class ActiveUser {
  constructor(public id: Id, public name: string, newSocket?: Socket) {
    this.id = id;
    this.pending_invite = false;
    this.ingame = false;
    this.socketUser = [];
    this.joinedChannel = [];
     this.name = name;
    if (newSocket) this.socketUser.push(newSocket);
  }
  pending_invite: boolean;
  ingame: boolean;
  socketUser: Socket[];
  joinedChannel: Channel[];
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
  addOne(userDto: UserDto): Promise<User> | undefined {
    const id = userDto.id;
    if (this.usersRepository.findOneBy({ id }) === undefined) {
      // A Comprendre plus tard
      // if( this.usersRepository.findOneBy({ userDto.id })=== undefined)
      const newUser = new User(userDto.name);
      // newUser.name = userDto.name;
      // newUser.friendlist = [];
      this.usersRepository.save(newUser);
    }
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

  sendMessageToUser(
	 wss: Server,
	   messageInfo:{ sender: Id; text: string; target: Id } ,
   ) {
	 const tempUser = this.arrayActiveUser.find(
	   (user) => user.id ===messageInfo.sender
	 );
	 if (tempUser) {
		 tempUser.socketUser.forEach((socket)=> wss.to(socket.id).emit("userToUser", messageInfo));
	 }
   }
}
