import { Entity, Column, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { DatabaseFile } from './databaseFile.entity';
import { Id } from 'backFrontCommon';

@Entity('User')
export class User {
  constructor(id: Id, name: string) {
    this.id = id;
    this.name = name;
  }
  @PrimaryColumn('int')
  id: Id;
  @Column({ type: 'varchar' })
  name: string;

  @Column('int', { array: true })
  friendlist: Id[] = [];

  @Column('varchar', { array: true })
  channel: string[] = [];

  @JoinColumn({ name: 'avatarId' })
  @OneToOne(() => DatabaseFile, { nullable: true })
  @Column({ type: 'int' })
  win: number = 0;
  @Column({ type: 'int' })
  loose: number = 0;
  @Column({ type: 'int' })
  score: number = 0;

  public avatar?: DatabaseFile;
  @Column({ nullable: true })
  public avatarId?: Id;

  @Column('int', { array: true })
  match: Id[] = [];

  /**
   * 2-Factor Auth TOTP secret in hex
   */
  // TODO: check if one should use undefined or null
  @Column('varchar', { nullable: true })
  totpSecret: string | null = null;
}
