import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { ChannelManagerService } from '../channelManager/channelManager.service';
import { MatchHistoryService } from '../matchHistory/matchHistory.service';
import { ChannelController } from '../channelManager/channelManager.controller';

import { DatabaseFilesController } from './databaseFile.controller';
import { HttpModule } from '@nestjs/axios';
import { UserService } from './user.service';
import { DatabaseFilesService } from './databaseFile.service';

import { User } from './entities/user.entity';
import { Match } from '../matchHistory/match.entity';
import { Channel } from '../channelManager/channel.entity';
import { DatabaseFile } from './entities/databaseFile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatService } from '../chat/chat.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, DatabaseFile, Channel, Match]),
    HttpModule,
  ],
  controllers: [
    UserController,
    DatabaseFilesController,
    ChannelController,
  ],
  providers: [
    ChatService,
    MatchHistoryService,
    UserService,
    DatabaseFilesService,
    ChannelManagerService,
  ],
  exports: [
    UserService,
    ChatService,
    DatabaseFilesService,
    MatchHistoryService,
    ChannelManagerService,
  ],
})
export class UserModule {}
