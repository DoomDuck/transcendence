import { Module } from "@nestjs/common";
import { userController } from "./user.controller";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [userController],
  providers: [UserService],
})
export class userModule {}
