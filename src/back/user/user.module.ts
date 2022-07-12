import { Module } from "@nestjs/common";
import { userController } from "./user.controller";
import { userService } from "./user.service";
import { user } from "./user.entity";
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
	imports:[TypeOrmModule.forFeature([user])],
  controllers: [userController],
  providers: [userService],
})
export class userModule {}
