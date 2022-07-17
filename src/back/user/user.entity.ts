import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
@Entity("user")
export class user {
  @PrimaryGeneratedColumn()
  id?: number;
  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  // @Column({ type: "number", length: 100, nullable: false })
  // @Column()
  // friendlist: number[];
  // @Column({ type: "varchar", length: 100, nullable: false })
  // domain: string;
}
