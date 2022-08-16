import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  PrimaryColumn,
} from 'typeorm';
import { Id } from 'backFrontCommon';
import { ChannelCategory } from 'backFrontCommon';
@Entity('Channel')
export class Channel {
  constructor(
    name: string,
    creator: Id,
    category: ChannelCategory,
    password?: string,
  ) {
    this.name = name;
    this.creator = creator;
    this.category = category;
    this.admin = [];
    this.admin.push(creator);
    this.member = [];
    if (password != undefined) this.password = password;
    else this.password = null;
  }

  @PrimaryColumn('varchar', { nullable: false })
  name: string;

  @Column('int', { nullable: false })
  creator: Id;

  @Column({ type: String, nullable: true })
  password: string | null;

  @Column('int', { array: true, nullable: true })
  admin: Id[];

  @Column('int', { array: true, nullable: true })
  member: Id[];

  @Column({ type: 'enum', enum: ChannelCategory, nullable: false })
  category: ChannelCategory;
}
