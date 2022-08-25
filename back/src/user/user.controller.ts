import { Controller, Get, Post, Body, Param, Logger } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UserDto } from './dto/user.dto';
import { Express } from 'express';
import { UploadedFile } from '@nestjs/common';
import { Id } from 'backFrontCommon';
import { Multer } from 'multer';

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

  @Get(':id')
  public async getUseById(@Param('id') id: Id): Promise<User | null> {
    return this.userService.findOneDb(id);
  }

  // @Delete(":id")
  // public async deleteuserdById(@Param("id") id: idnumber):Promise<User | null> {
  // return this.userService.remove(id);
  // }

  // @Post('avatar')
  // // @UseInterceptors(FileInterceptor('file'))
  // async addAvatar(
  // @Body() userDto: UserDto,
  // @UploadedFile() file: Express.Multer.File,
  // // @Body() addAvatarDto: {userId: Id, image: Blob}
  // ): Promise<boolean> {
  // // console.log("uploaded file:", addAvatarDto.image);
  // return this.userService.addAvatar(
  // userDto.id,
  // file.buffer,
  // file.originalname,
  // );
  // }

  // LUCAS DEBUG
}
