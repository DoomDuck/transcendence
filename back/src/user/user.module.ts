import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserHistoryController } from './userHistory.controller';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { ChannelController } from '../channelManager/channelManager.controller';
import { DatabaseFilesController } from './databaseFile.controller';
import { UserService } from './user.service';
import { DatabaseFilesService } from './databaseFile.service';
import { User } from './user.entity';
import { DatabaseFile } from './databaseFile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from '../chat/chat.gateway';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([DatabaseFile]),
  ],
  controllers: [
    UserController,
    UserHistoryController,
    DatabaseFilesController,
    ChannelController,
  ],
  providers: [
    ChatGateway,
    UserService,
    DatabaseFilesService,
    ChannelManagerService,
  ],
})
export class userModule {}
