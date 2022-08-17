import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { userModule } from './user/user.module';
import { PongGateway } from './pong/pong.gateway';
import { GameManagerService } from './pong/game-manager.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(config),
    userModule,
  ],
  controllers: [],
  providers: [PongGateway, GameManagerService],
})
export class AppModule {}
