import { Injectable /*, HttpException*/ } from "@nestjs/common";
import { User } from "./user.entity";
import { UserDto } from "./user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
// import { AppDataSource } from "./../data-source";
import { DatabaseFilesService } from "./databaseFiles.service";
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
  //surement nul a chier mais je test des trucs
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
    return 1;
  }
}
//////////////// check by id or name ? sync database user and active user ?///////////////////////
// isOnline(id: numbers): boolean {
// const found = this.array_active_User.find(
// (activeUser) => activeUser.id === name
// );
// if (found === undefined) return false;
// else return true;
// }

// isPending(name: string): boolean {
// const found = this.array_active_User.find(
// (activeUser) => activeUser.name === name
// );
// if (found === undefined) return false;
// else return found.pending_invite;
// }
// isIngame(name: string): boolean {
// const found = this.array_active_User.find(
// (activeUser) => activeUser.name === name
// );
// if (found === undefined) return false;
// else return found.ingame;
// }
// }
//USER PART WITHOUT DATABASE
// private users = users;
// public async getusers() {
// return this.users;
// }
// public postuser(user) {
// return this.users.push(user);
// }
// public getuserById(id: number): Promise<any> {
// const userid = Number(id);
// const user = this.users.find((user) => user.id === userid);
// return new Promise((resolve) => {
// if (!user) {
// throw new HttpException("Not Found", 404);
// }
// return resolve(user);
// });
// }
// public deleteuserById(id: number): Promise<any> {
// const userid = Number(id);
// return new Promise((resolve) => {
// const index = this.users.findIndex((user) => user.id === userid);
// if (index === -1) {
// throw new HttpException("Not Found", 404);
// }
// this.users.splice(index, 1);
// return resolve(this.users);
// });
// }
// public putuserById(
// id: number,
// propertyName: string,
// propertyValue: string
// ): Promise<any> {
// const userid = Number(id);
// return new Promise((resolve) => {
// const index = this.users.findIndex((user) => user.id === userid);
// if (index === -1) {
// throw new HttpException("Not Found", 404);
// }
// this.users[index][propertyName] = propertyValue;
// return resolve(this.users);
// });
// }
// }
