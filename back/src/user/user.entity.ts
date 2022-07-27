import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DatabaseFile } from './databaseFile.entity';
import { Id } from '../customType';
@Entity('User')
export class User {
  constructor(_name: string, _id?: Id) {
    if (_id) this.id = _id;
    this.name = _name;
    this.friendlist = [];
  }
  @PrimaryGeneratedColumn()
  id!: Id;
  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column('int', { array: true, nullable: false })
  friendlist: Id[];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  public avatar?: DatabaseFile;
  @Column({ nullable: true })
  public avatarId?: Id;
}
