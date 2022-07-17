import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Logger,
  Query,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UserDto } from "./user.dto";
import { FriendRequestDto } from "./friendRequest.dto";
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import {  Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Multer } from 'multer';
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
	@Post('avatar')
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: Express.Multer.File) {
    return this.userService.addAvatar(request.user.id, file.buffer, file.originalname);
  }

  // @Put(":id")
  // public async putuserById(@Param("id") id: number, @Query() query) {
  // const propertyName = query.property_name;
  // const propertyValue = query.property_value;
  // return this.userService.putuserById(id, propertyName, propertyValue);
  // }
}
