import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { CarModule } from './car/car.module';
import { ChatGateway } from './chat/chat.gateway';
import { AlertGateway } from './alert/alert.gateway';
import { AlertController } from './alert/alert.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PongGateway } from './pong/pong.gateway';

@Module({
  //imports: [TypeOrmModule.forRoot(config), CarModule],
  imports: [CarModule],
  controllers: [AlertController],
  providers: [ChatGateway, AlertGateway, PongGateway],
})
export class AppModule {}
