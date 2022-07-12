import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { config } from "./orm.config";
// import { CarModule } from "./car/car.module";
import { userModule } from "./user/user.module";
import { ChatGateway } from "./chat/chat.gateway";
import { AlertGateway } from "./alert/alert.gateway";
import { AlertController } from "./alert/alert.controller";
import { PongGateway } from "./pong/pong.gateway";
import { GameManagerService } from "./pong/game-manager.service";
import { ChannelManagerModule } from "./channel_manager/channel_manager.module";

@Module({
  imports: [TypeOrmModule.forRoot(config), userModule, ChannelManagerModule],
  // imports: [CarModule],
  controllers: [AlertController],
  providers: [ChatGateway, AlertGateway, PongGateway, GameManagerService],
})
export class AppModule {}
