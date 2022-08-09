import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';
import { Id } from '../customType';
import { ChannelCategory } from 'chat';
@Entity('Channel')
export class Channel {
  constructor(
    name: string,
    creator: number,
    category: ChannelCategory,
    password?: string,
  ) {
    this.name = name;
    this.creator = creator;
    this.category = category;
    this.admin = [];
    this.member = [];
    if (password != undefined) this.password = password;
    else this.password = null;
  }

  @PrimaryColumn()
  name: string;

  @Column({ nullable: false })
  creator: number;

  @Column({ type: String, nullable: true })
  password: string | null;

  @Column('int', { array: true, nullable: true })
  admin: Id[];

  @Column('int', { array: true, nullable: true })
  member: Id[];

  @Column({ type: 'enum', enum: ChannelCategory, nullable: false })
  category: ChannelCategory;
}
