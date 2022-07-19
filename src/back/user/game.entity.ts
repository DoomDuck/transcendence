import { idnumber } from "../customType";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from "typeorm";
@Entity("game")
export class Gane {
  @PrimaryGeneratedColumn()
  id: idnumber;
  @Column({ type: "varchar", length: 100, nullable: false })
  playerOne: string;

  @Column({ type: "varchar", length: 100, nullable: false })
  playerTwo: string;

  @Column("int")
  playerOneScore: idnumber;

  @Column("int")
  playerTwoScore: idnumber;

  @CreateDateColumn()
  created_at: Date;
}
