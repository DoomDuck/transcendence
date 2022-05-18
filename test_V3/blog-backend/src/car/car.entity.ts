import {Entity, Column} from 'typeorm';
import {BaseEntity} from './base-entity';
@Entity('car')
export class car extends BaseEntity {
	@Column({type: 'varchar', length: 100, nullable:false})
	name: string;

	@Column({type: 'varchar', length: 100, nullable:false})
	domain: string;
} 
