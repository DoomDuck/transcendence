import { Injectable, HttpException } from '@nestjs/common';
import {CARS} from './cars.mock'
@Injectable()
export class CarService {
	private cars = CARS;
	public async getCars(){
		return this.cars;
	}
	public  postCar(car){
		return this.cars.push(car); 
	}
	public  getCarById(id:number): Promise<any>{
		const carid=Number(id);
		const car = this.cars.find(car => car.id === carid);
		return new Promise((resolve)=>{
			if (!car)
				{
					throw new HttpException('Not Found',404);
				}
				return resolve(car);
		});
	}
	public  deleteCarById(id:number): Promise<any>{

		const carid=Number(id);
		return new Promise((resolve)=>{
			const index = this.cars.findIndex(car => car.id === carid);
			if (index === -1)
				{
					throw new HttpException('Not Found',404);
				}
				this.cars.splice(index,1);
				return resolve(this.cars);
		});
	}
	public  putCarById(id:number, propertyName: string, propertyValue:string): Promise<any>{

		const carid=Number(id);
		return new Promise((resolve)=>{
			const index = this.cars.findIndex(car => car.id === carid);
			if (index === -1)
				{
					throw new HttpException('Not Found',404);
				}
				this.cars[index][propertyName] = propertyValue;
				return resolve(this.cars);
		});
	}
}
