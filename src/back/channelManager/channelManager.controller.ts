import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  Body,
  Param,
  Query,
} from "@nestjs/common";
import { ChannelManagerService } from "./channelManager.service";
import { ChannelDto } from "./channel.dto";
import { Channel } from "./channelManager.service";

@Controller("channel")
export class ChannelController {
  constructor(private channelManagerService: ChannelManagerService) {}
  @Get()
  async getChannel(): Promise<Channel[] | string> {
    return this.channelManagerService.findChanAll();
  }
  @Post()
  public createChan(@Body() channelDto: ChannelDto) {
    return this.channelManagerService.createChan(channelDto);
  }

  // @Get(":id")
  // public async getCarById(@Param("id") id: number) {
  // return this.carService.getCarById(id);
  // }
  //
  // @Delete(":id")
  // public async deleteCardById(@Param("id") id: number) {
  // return this.carService.deleteCarById(id);
  // }
  //
  // @Put(":id")
  // public async putCarById(@Param("id") id: number, @Query() query) {
  // const propertyName = query.property_name;
  // const propertyValue = query.property_value;
  // return this.carService.putCarById(id, propertyName, propertyValue);
  // }
}
