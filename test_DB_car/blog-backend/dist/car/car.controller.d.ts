import { CarService } from './car.service';
import { CarDto } from './car.dto';
export declare class CarController {
    private carService;
    constructor(carService: CarService);
    getCars(): Promise<{
        id: number;
        brand: string;
        color: string;
        model: string;
    }[]>;
    postCar(car: CarDto): number;
    getCarById(id: number): Promise<any>;
    deleteCardById(id: number): Promise<any>;
    putCarById(id: number, query: any): Promise<any>;
}
