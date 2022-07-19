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
import { ChannelManagerService } from "./channel_manager.service";
import { channelDto } from "./channel.dto";

@Controller("channel")
export class channelController {
  constructor(private channel_manager_service: ChannelManagerService) {}
  // @Get()
  // async getChannel() {
  // return this.carService.getCars();
  // }
  // @Post()
  // public createChan(@Body() car: CarDto) {
  // return this.channel_manager_service.create_chan(car);
  // }

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
