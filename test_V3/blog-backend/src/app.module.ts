import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';
import { CarModule } from './car/car.module';
@Module({
  imports: [TypeOrmModule.forRoot(config), CarModule],
})
export class AppModule {}
