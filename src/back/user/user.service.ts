import { Injectable, Logger } from "@nestjs/common";
import { User } from "./user.entity";
import { UserDto } from "./user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DatabaseFilesService } from "./databaseFile.service";
import { Id } from "../customType";
import { Socket } from "socket.io";

export class ActiveUser {
	constructor(
	public id:Id,
	)
	{
	this.id=id;
	this.pending_invite = false ;
  	this.ingame= false;
	}
  name: string;
  pending_invite: boolean;
  ingame: boolean;
  socketUser:	Socket[];
}

@Injectable()
export class UserService {
  arrayActiveUser: ActiveUser[];
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly databaseFilesService: DatabaseFilesService
  ) {}
  findAllDb(): Promise<User[]> {
    return this.usersRepository.find();
  }
	findOneActive(id: Id): ActiveUser | undefined {
    return this.arrayActiveUser.find(element=> element.id===( id ));
  }

  findOneDb(id: Id): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async remove(id: Id): Promise<void> {
    await this.usersRepository.delete(id);
  }
  addOneDb(userDto: UserDto): Promise<User> {
    const newUser = new User();
    newUser.name = userDto.name;
    newUser.friendlist = [];
    return this.usersRepository.save(newUser);
  }
  async addFriend(sender: Id, target: Id): Promise<string | User> {
    let tempSender = await this.usersRepository
      .createQueryBuilder("User")
      .where("User.id = :sender", { sender })
      .getOne();
    let tempTarget = await this.usersRepository
      .createQueryBuilder("User")
      .where("User.id = :sender", { sender })
      .getOne();
    if (tempSender === null) return "Sender does not exist";
    if (tempTarget === null) return "Target does not exist";
    if (
      tempSender.friendlist.find((element) => element === target) === undefined
    ) {
      tempSender.friendlist.push(target);
      return this.usersRepository.save(tempSender);
    } else return "Already friends";
  }
  async addAvatar(
    userId: Id,
    imageBuffer: Buffer,
    filename: string
  ): Promise<boolean> {
    const avatar = await this.databaseFilesService.uploadDatabaseFile(
      imageBuffer,
      filename
    );
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
    //A MODIFIER
    return true;
  }
}
