import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { userModule } from './user/user.module';
import { AlertGateway } from './alert/alert.gateway';
import { AlertController } from './alert/alert.controller';
import { PongGateway } from './pong/pong.gateway';
import { GameManagerService } from './pong/game-manager.service';

@Module({
  imports: [TypeOrmModule.forRoot(config), userModule],
  controllers: [AlertController],
  providers: [AlertGateway, PongGateway, GameManagerService],
})
export class AppModule {}
