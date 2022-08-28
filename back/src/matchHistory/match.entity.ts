import {
  CreateDateColumn,
  Entity,
  Column,
  JoinColumn,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Id } from 'backFrontCommon';
import { User } from '../user/entities/user.entity';
@Entity('Match')
export class Match {
  constructor(player: User[], score: number[]) {
    this.player = Promise.resolve(player);

    this.score = score;
  }

  @PrimaryGeneratedColumn()
  id?: Id;
  // @ManyToMany(() => User, (user) => user.match)
  @ManyToMany(() => User, (user) => user.match)
  player: Promise<User[]>;
  @Column('int', { array: true })
  score: number[];
  @CreateDateColumn()
  date!: Date;
}
