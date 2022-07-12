import { Injectable, HttpException } from "@nestjs/common";
import { users } from "./users.mock";
import { user } from "./user.entity";
import { UserDto } from "./user.dto";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
@Injectable()
export class userService {
	constructor(
		@InjectRepository(user)
		private usersRepository: Repository<user>,
	){}
	findAll(): Promise<user[]>
	{
		return this.usersRepository.find();
	}
	findOne(id: number): Promise<user>{
		return this.usersRepository.findOneBy({ id });
	}
	async remove(id: number): Promise<void>{
		await this.usersRepository.delete(id);
	}
	addOne(	userDto:UserDto ): Promise<user>{
		const newUser = new user();
		newUser.id = userDto.id;
		newUser.name = userDto.name;
		return this.usersRepository.save(newUser);
	}
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
}
