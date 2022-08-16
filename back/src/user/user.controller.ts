import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
} from '@nestjs/common';

import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { FriendRequestDto } from './dto/friendRequest.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { Multer } from 'multer';
import { Id, ChatUserDto } from 'backFrontCommon';

@Controller('user')
export class UserController {
  private logger: Logger = new Logger('User');
  constructor(private userService: UserService) {}
  @Get()
  async getUser() {
    return this.userService.findAllDb();
  }
  // @Get(':id')
  // async getHistory(@Param('id') id: Id): Promise<UserHistoryDto | undefined> {
  // this.logger.log('get history id');
  // return this.userService.getUserHistory(id);
  // }
  @Post()
  public postUser(@Body() user: UserDto) {
    return this.userService.addOne(user);
  }
  @Post('friendRequest')
  public addFriend(@Body() friendRequest: FriendRequestDto) {
    return this.userService.addFriend(
      friendRequest.sender,
      friendRequest.target,
    );
  }

  @Get(':id')
  public async getUseById(@Param('id') id: Id): Promise<User | null> {
    return this.userService.findOneDb(id);
  }

  // @Delete(":id")
  // public async deleteuserdById(@Param("id") id: idnumber):Promise<User | null> {
  // return this.userService.remove(id);
  // }

  @Post('avatar')
  // @UseInterceptors(FileInterceptor('file'))
  async addAvatar(
    @Body() userDto: UserDto,
    @UploadedFile() file: Express.Multer.File,
    // @Body() addAvatarDto: {userId: Id, image: Blob}
  ): Promise<boolean> {
    // console.log("uploaded file:", addAvatarDto.image);
    return this.userService.addAvatar(
      userDto.id,
      file.buffer,
      file.originalname,
    );
  }

  // LUCAS DEBUG

  @Get('chat/:id')
  async getUserChatData(
    @Param('id') userId: number,
  ): Promise<ChatUserDto | null> {
    const user = await this.userService.findOneDb(userId);
    if (user === null) return null;
    return {
      id: userId,
      name: user.name,
      image: '',
      profile: {
        ranking: (await this.userService.getLeaderboard()).findIndex(
          (user2) => user2.id == user.id,
        ),
        matchHistory: [],
      },
    };
  }
}
