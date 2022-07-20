import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { DatabaseFilesController } from "./databaseFile.controller";
import { UserService } from "./user.service";
import { DatabaseFilesService } from "./databaseFile.service";
import { User } from "./user.entity";
import { DatabaseFile } from "./databaseFile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([DatabaseFile]),
  ],
  controllers: [UserController, DatabaseFilesController],
  providers: [UserService, DatabaseFilesService],
})
export class userModule {}
