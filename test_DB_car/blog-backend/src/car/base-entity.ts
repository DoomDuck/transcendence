import {PrimaryGeneratedColumn, CreateDateColumn} from 'typeorm';
export class BaseEntity {
	//autoincrement
	@PrimaryGeneratedColumn()
	id?: number;


	@CreateDateColumn({nullable:true})
	createAt?: Date;


	@CreateDateColumn({nullable:true})
	updateAt?: Date;
} 
