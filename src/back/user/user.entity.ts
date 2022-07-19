import {
  Entity,
  Column,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { DatabaseFile } from "./databaseFile.entity";
import { idnumber } from "../customType";
@Entity("User")
export class User {
  @PrimaryGeneratedColumn()
  id: idnumber;
  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  @Column("int", { array: true, nullable: false })
  friendlist: idnumber[];

  @JoinColumn({ name: "avatarId" })
  @OneToOne(() => DatabaseFile, {
    nullable: true,
  })
  public avatar?: DatabaseFile;
  @Column({ nullable: true })
  public avatarId?: idnumber;
}
