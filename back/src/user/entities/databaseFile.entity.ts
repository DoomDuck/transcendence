import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class DatabaseFile {
  constructor(_filename: string, _data: Uint8Array) {
    this.filename = _filename;
    this.data = _data;
  }
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column()
  filename: string;

  @Column({
    type: 'bytea',
  })
  data: Uint8Array;
}
