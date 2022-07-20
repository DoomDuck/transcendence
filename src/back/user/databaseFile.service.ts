import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { DatabaseFile } from "./databaseFile.entity";

import { Id } from "../customType";
@Injectable()
export class DatabaseFilesService {
  constructor(
    @InjectRepository(DatabaseFile)
    private databaseFilesRepository: Repository<DatabaseFile>
  ) {}

  async uploadDatabaseFile(
    dataBuffer: Buffer,
    filename: string
  ): Promise<DatabaseFile> {
    const newFile = this.databaseFilesRepository.create({
      filename,
      data: dataBuffer,
    });
    await this.databaseFilesRepository.save(newFile);
    return newFile;
  }

  async getFileById(id: Id): Promise<DatabaseFile> {
    const file = await this.databaseFilesRepository.findOneBy({ id });
    if (!file) {
      // need change for consistency
      throw new NotFoundException();
    }
    return file;
  }
}
