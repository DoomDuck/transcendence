export interface IPositionSpeedSettable {
    setPositionSpeed(x: number, y: number, vx: number, vy: number): void;
}

export function isPositionSpeedSettable(o: any): o is IPositionSpeedSettable {
    return 'setPositionSpeed' in o;
}
