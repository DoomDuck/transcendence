import { Vector3 } from "three";

export interface IDeformable {
    deform(distanceVectorMin: Vector3): void;
    resetForm(): void;
}

export function isDeformable(o: any): o is IDeformable {
    return 'deform' in o && 'resetForm' in o;
}
