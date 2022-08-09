import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { Channel } from './channelManager/channel.entity';
import { DatabaseFile } from './user/databaseFile.entity';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'hgallien',
  password: 'root',
  port: 5432,
  host: '127.0.0.1',
  database: 'postgres',
  synchronize: true,
  entities: [User, DatabaseFile,Channel],
  // entities: ["dist/**/*.entity{.ts,.js}"],
};
