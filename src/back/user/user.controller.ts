import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./user.dto";
import { FriendRequestDto } from "./friendRequest.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { Express } from "express";
import { UploadedFile, UseInterceptors } from "@nestjs/common";
import { Multer } from "multer";
@Controller("user")
export class userController {
  private logger: Logger = new Logger("User");
  constructor(private userService: UserService) {}
  @Get()
  async getusers() {
    return this.userService.findAll();
  }
  @Post()
  public postuser(@Body() user: UserDto) {
    // this.logger.log(user.name);
 return this.userService.addOne(user);
  }
  @Post("friendRequest")
  public addfriend(@Body() friendRequest: FriendRequestDto) {
    // this.logger.log(user.name);
    return this.userService.addFriend(
      friendRequest.sender,
      friendRequest.target
    );
  }

  @Get(":id")
  public async getuserById(@Param("id") id: number) {
    return this.userService.findOne(id);
  }

  @Delete(":id")
  public async deleteuserdById(@Param("id") id: number) {
    return this.userService.remove(id);
  }
  @Post("avatar")
  @UseInterceptors(FileInterceptor("file"))
  async addAvatar(
     @Body() userDto: UserDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    this.logger.log(userDto.id);
    return this.userService.addAvatar(
      userDto.id,
      file.buffer,
      file.originalname
    );
  }
}
