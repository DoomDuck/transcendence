import { Injectable, HttpException } from "@nestjs/common";
import { users } from "./users.mock";
import { user } from "./user.entity";
import { UserDto } from "./user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AppDataSource } from "./../data-source";
export class activeUser {
  name: string;
  pending_invite: boolean;
  ingame: boolean;
}
@Injectable()
export class userService {
  array_active_User: activeUser[];
  constructor(
    @InjectRepository(user)
    private usersRepository: Repository<user>
  ) {}
  findAll(): Promise<user[]> {
    return this.usersRepository.find();
  }
  findOne(id: number): Promise<user> {
    return this.usersRepository.findOneBy({ id });
  }
  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
  addOne(userDto: UserDto): Promise<user> {
    const newUser = new user();
    newUser.name = userDto.name;
    return this.usersRepository.save(newUser);
  }
  //surement nul a chier mais je test des trucs
  async addFriend(sender: number, target: number) {
    const tempUser = await AppDataSource.getRepository(user)
      .createQueryBuilder("user")
      .where("user.id = :sender", { sender })
      .getOne();

    let temp = tempUser.friendlist;
    temp.friendlist.push(target);
    await AppDataSource.createQueryBuilder()
      .update(user)
      .set({ friendlist: temp })
      .where("user.id = :sender", { sender })
      .execute();
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
