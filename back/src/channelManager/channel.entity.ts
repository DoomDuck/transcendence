import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Id } from '../customType';
import type {ChannelCategory} from 'chat';
@Entity('Channel')
export class Channel {
  constructor(name: string, creator:Id, category : ChannelCategory, password?:string  ) {
    this.name = name;
    this.creator =creator;
	this.category = category;
	this.admin = [];
    this.member = [];
	if(password != undefined)
		this.password=password;
	else
		this.password=null;
  }

  @PrimaryGeneratedColumn()
  id?:Id;
  @Column({  length: 100, nullable: false })
  name: string;

  @Column({  length: 100, nullable: false })
  creator:Id;

  @Column({ type: 'varchar', length: 100, nullable: true })
  password: string | null;

  @Column({  length: 100, nullable: true })
  admin: Id[];

  @Column({  length: 100, nullable: true })
  member: Id[];

  @Column({length: 100, nullable: false })
  category: ChannelCategory;

}
