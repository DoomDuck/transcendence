import { Entity, Column } from "typeorm";
import { BaseEntity } from "./base-entity";
@Entity("user")
export class user extends BaseEntity {
  @Column({ type: "varchar", length: 100, nullable: false })
  name: string;

  // @Column({ type: "varchar", length: 100, nullable: false })
  // domain: string;
}
