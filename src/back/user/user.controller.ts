import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
} from "@nestjs/common";

import { Id } from "../customType";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { UserDto } from "./user.dto";
import { FriendRequestDto } from "./friendRequest.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { Multer } from "multer";
@Controller("user")
export class UserController {
  private logger: Logger = new Logger("User");
  constructor(private userService: UserService) {}
  @Get()
  async getUser() {
    return this.userService.findAll();
  }
  @Post()
  public postUser(@Body() user: UserDto) {
    // this.logger.log(user.name);
    return this.userService.addOne(user);
  }
  @Post("friendRequest")
  public addFriend(@Body() friendRequest: FriendRequestDto) {
    // this.logger.log(user.name);
    return this.userService.addFriend(
      friendRequest.sender,
      friendRequest.target
    );
  }

  @Get(":id")
  public async getUseById(@Param("id") id: Id): Promise<User | null> {
    return this.userService.findOne(id);
  }

  // @Delete(":id")
  // public async deleteuserdById(@Param("id") id: idnumber):Promise<User | null> {
  // return this.userService.remove(id);
  // }
  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  async addAvatar(
    @Body() userDto: UserDto,
    @UploadedFile() file: Express.Multer.File
  ): Promise<boolean> {
    this.logger.log(userDto.id);
    return this.userService.addAvatar(
      userDto.id,
      file.buffer,
      file.originalname
    );
  }
}
