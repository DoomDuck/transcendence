import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserHistoryController } from './userHistory.controller';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { ChannelController } from '../channelManager/channelManager.controller';
import { MatchHistoryController } from '../matchHistory/matchHistory.controller';
import { DatabaseFilesController } from './databaseFile.controller';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user.service';
import { DatabaseFilesService } from './databaseFile.service';
import { MatchHistoryService } from '../matchHistory/matchHistory.service';
import { User } from './entities/user.entity';
import { Channel } from '../channelManager/channel.entity';
import { DatabaseFile } from './entities/databaseFile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGateway } from '../chat/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DatabaseFile, Channel]),
    HttpModule,
  ],
  controllers: [
    MatchHistoryController,
    UserController,
    UserHistoryController,
    DatabaseFilesController,
    ChannelController,
  ],
  providers: [
    MatchHistoryService,
    ChatGateway,
    UserService,
    DatabaseFilesService,
    ChannelManagerService,
  ],
  exports: [
    UserService,
  ]
})
export class UserModule {}
