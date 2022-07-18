import { Module } from "@nestjs/common";
import { userController } from "./user.controller";
import { DatabaseFilesController } from "./databaseFiles.controller";
import { UserService } from "./user.service";
import { DatabaseFilesService } from "./databaseFiles.service";
import { User } from "./user.entity";
import { DatabaseFile } from "./databaseFile.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([DatabaseFile]),
  ],
  controllers: [userController, DatabaseFilesController],
  providers: [UserService, DatabaseFilesService],
})
export class userModule {}
