export declare class CarService {
    private cars;
    getCars(): Promise<{
        id: number;
        brand: string;
        color: string;
        model: string;
    }[]>;
    postCar(car: any): number;
    getCarById(id: number): Promise<any>;
    deleteCarById(id: number): Promise<any>;
    putCarById(id: number, propertyName: string, propertyValue: string): Promise<any>;
}
