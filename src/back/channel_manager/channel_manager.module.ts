import { Module } from "@nestjs/common";
import { ChannelManagerService } from "./channel_manager.service";

@Module({
  providers: [ChannelManagerService],
})
export class ChannelManagerModule {}
