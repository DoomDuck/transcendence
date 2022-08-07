import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Logger,
} from '@nestjs/common';

import { Id } from '../customType';
import { UserService } from './user.service';
import { UserHistoryDto } from './userHistory.dto';

@Controller('history')
export class UserHistoryController {
  constructor(private userService: UserService) {}
  private logger: Logger = new Logger('userhistory');
  @Get(':id')
  async getHistory(@Param('id') id: Id): Promise<UserHistoryDto | null> {
    this.logger.log('get history id');
    return this.userService.getUserHistory(id);
  }
}
