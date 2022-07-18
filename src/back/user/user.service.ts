import { Injectable } from "@nestjs/common";
import { User } from "./user.entity";
import { UserDto } from "./user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DatabaseFilesService } from "./databaseFiles.service";
//used for debug
// import { Logger } from "@nestjs/common";
export class ActiveUser {
  name: string;
  pending_invite: boolean;
  ingame: boolean;
}
@Injectable()
export class UserService {
  // private logger: Logger = new Logger("UserService");
  array_active_User: ActiveUser[];
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly databaseFilesService: DatabaseFilesService
  ) {}
  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  addOne(userDto: UserDto): Promise<User> {
    const newUser = new User();
    newUser.name = userDto.name;
    newUser.friendlist = [];
    return this.usersRepository.save(newUser);
  }
  async addFriend(sender: number, target: number) {
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
  async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.databaseFilesService.uploadDatabaseFile(
      imageBuffer,
      filename
    );
    await this.usersRepository.update(userId, {
      avatarId: avatar.id,
    });
	//A MODIFIER
    return 1;
  }
}
