import {
  CreateDateColumn,
  Entity,
  Column,
  JoinColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Id } from 'backFrontCommon';
import { User } from '../user/entities/user.entity';
@Entity('Match')
export class Match {
  constructor(
    playerOne: Id,
    playertwo: Id,
    playerOneScore: number,
    playertwoScore: number,
    winner: Id,
  ) {
    this.playerOne = playerOne;
    this.playerTwo = playertwo;
    this.playerOneScore = playerOneScore;
    this.playertwoScore = playertwoScore;
    this.winner = winner;
  }

  @PrimaryGeneratedColumn()
  id?: Id;

  @Column({ type: 'int', nullable: false })
  playerOne: Id;

  @Column({ type: 'int', nullable: false })
  playerTwo: Id;

  @JoinColumn({ name: 'playerOne' })
  @Column('varchar', { array: true, nullable: false })
  playerOneScore: number;
  @JoinColumn({ name: 'playertwo' })
  @Column('varchar', { array: true, nullable: false })
  playertwoScore: number;

  @Column({ type: 'int', nullable: false })
  winner: number;
  @CreateDateColumn()
  createdDate!: Date;
}
