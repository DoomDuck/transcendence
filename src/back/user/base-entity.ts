import { PrimaryGeneratedColumn, CreateDateColumn } from "typeorm";
export class BaseEntity {
  //autoincrement
  @PrimaryGeneratedColumn()
  id?: number;
}
