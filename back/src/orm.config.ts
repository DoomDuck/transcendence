import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { Match } from './matchHistory/match.entity';
import { Channel } from './channelManager/channel.entity';
import { DatabaseFile } from './user/entities/databaseFile.entity';
import { ConfigService } from '@nestjs/config';

export function typeOrmFactory(config: ConfigService): TypeOrmModuleOptions {
  return {
    type: 'postgres',
    username: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    port: 5432,
    host: config.get('POSTGRES_DB'),
    database: 'postgres',
    // TODO: CHANGE IN PRODUCTION
    synchronize: true,
    entities: [User, DatabaseFile, Channel, Match],
    // entities: ["dist/**/*.entity{.ts,.js}"],
  };
}
