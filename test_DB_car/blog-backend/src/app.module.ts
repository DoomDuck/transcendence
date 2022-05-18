import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { CarModule } from './car/car.module';
import { SocketGateway } from './socket.gateway';
@Module({
  imports: [TypeOrmModule.forRoot(config), CarModule],
  providers: [SocketGateway],
})
export class AppModule {}
