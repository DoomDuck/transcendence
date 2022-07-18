import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatabaseFile } from "./databaseFile.entity";
@Entity("User")
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column("int", { array: true, nullable: false })
  friendlist: number[];

  @JoinColumn({ name: "avatarId" })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  public avatar?: DatabaseFile;
  @Column({ nullable: true })
  public avatarId?: number;
}
