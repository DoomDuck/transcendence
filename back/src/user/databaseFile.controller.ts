import {
  Controller,
  Get,
  Param,
  StreamableFile,
  Res,
  ParseIntPipe,
} from '@nestjs/common';
import { DatabaseFilesService } from './databaseFile.service';
import { Readable } from 'stream';
import { Response } from 'express';
import { Id } from 'backFrontCommon';
@Controller('avatar')
export class DatabaseFilesController {
  constructor(private readonly databaseFilesService: DatabaseFilesService) {}

  @Get(':id')
  async getDatabaseFileById(
    @Param('id', ParseIntPipe) id: Id,
    @Res({ passthrough: true }) response: Response,
  ): Promise<StreamableFile> {
    const file = await this.databaseFilesService.getFileById(id);

    const stream = Readable.from(file.data);
    response.set({
      'Content-Disposition': `inline; filename="${file.filename}"`,
      'Content-Type': 'image',
    });
    return new StreamableFile(stream);
  }
}
