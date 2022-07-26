import { Id } from "../customType";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
@Entity("game")
export class Gane {
  @PrimaryGeneratedColumn()
  id: Id;
  @Column({ type: "varchar", length: 100, nullable: false })
  playerOne: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  playerTwo: string;

  @Column("int")
  playerOneScore: Id;

  @Column("int")
  playerTwoScore: Id;

  @CreateDateColumn()
  created_at: Date;
}
