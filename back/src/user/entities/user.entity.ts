import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  PrimaryColumn,
  JoinTable,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DatabaseFile } from './databaseFile.entity';
import { Match } from '../../matchHistory/match.entity';
import { Id } from 'backFrontCommon';

@Entity('User')
export class User {
  constructor(id: Id, name: string) {
    this.id = id;
    this.name = name;
    this.friendlist = [];
    // this.matchAsPlayerOne = [];
    // this.matchAsPlayerTwo = [];
  }
  @PrimaryColumn('int')
  id: Id;
  @Column({ type: 'varchar' })
  name: string;

  @Column('int', { array: true })
  friendlist: Id[] = [];

  @Column('int', { array: true })
  blocked: Id[] = [];

  @Column('int', { array: true })
  blockedFrom: Id[] = [];

  @Column('varchar', { array: true })
  channel: string[] = [];

  @Column({ type: 'int' })
  win: number = 0;

  @Column({ type: 'int' })
  loose: number = 0;

  @Column({ type: 'int' })
  score: number = 0;
  //
  @Column({ type: 'varchar', nullable: true })
  avatar: string | null = null;
  // public avatar?: DatabaseFile;
  // @Column({ nullable: true })
  // public avatarId?: Id;
  @ManyToMany(() => Match, (match) => match.player)
  @JoinTable()
  match!: Promise<Match[]>;
  /**
   * 2-Factor Auth TOTP secret in hex
   */
  // TODO: check if one should use undefined or null
  @Column('varchar', { nullable: true })
  totpSecret: string | null = null;
  // @OneToMany(() => Match, (match) => match.playerOne)
  // matchAsPlayerOne: Match[];
  // @OneToMany(() => Match, (match) => match.playerTwo)
  // matchAsPlayerTwo: Match[];
  // // @Column('int', { array: true, nullable: false })
  // // match: Id[];
}
