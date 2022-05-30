import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { CarModule } from './car/car.module';
import { SocketGateway } from './socket.gateway';
import { ChatGateway } from './chat/chat.gateway';
import { AlertGateway } from './alert/alert.gateway';
import { AlertController } from './alert/alert.controller';
@Module({
  imports: [TypeOrmModule.forRoot(config), CarModule],
  providers: [SocketGateway, ChatGateway, AlertGateway],
  controllers: [AlertController],
})
export class AppModule {}
