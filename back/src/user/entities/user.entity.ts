import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  ManyToMany,
  PrimaryColumn,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DatabaseFile } from './databaseFile.entity';
import { Id } from 'backFrontCommon';
@Entity('User')
export class User {
  constructor(id: Id, name: string) {
    this.id = id;
    this.name = name;
    this.friendlist = [];
    this.channel = [];
    this.blocked = [];
    this.win = 0;
    this.loose = 0;
    this.score = 0;
    this.match = [];
  }
  @PrimaryColumn('int')
  id: Id;
  @Column({ type: 'varchar', nullable: false })
  name: string;

  @Column('int', { array: true, nullable: false })
  friendlist: Id[];

  @Column('int', { array: true, nullable: false })
  blocked: Id[];

  @Column('varchar', { array: true, nullable: false })
  channel: string[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  @Column({ type: 'int', nullable: false })
  win: number;
  @Column({ type: 'int', nullable: false })
  loose: number;
  @Column({ type: 'int', nullable: false })
  score: number;

  public avatar?: DatabaseFile;
  @Column({ nullable: true })
  public avatarId?: Id;

  @Column('int', { array: true, nullable: false })
  match: Id[];
}
