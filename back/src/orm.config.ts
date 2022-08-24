import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import {  Match} from './matchHistory/match.entity';
import { Channel } from './channelManager/channel.entity';
import { DatabaseFile } from './user/entities/databaseFile.entity';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'hgallien',
  password: 'root',
  port: 5432,
  host: '127.0.0.1',
  database: 'postgres',
  synchronize: true,
  entities: [User, DatabaseFile, Channel, Match],
  // entities: ["dist/**/*.entity{.ts,.js}"],
};
