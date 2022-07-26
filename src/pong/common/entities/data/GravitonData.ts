import { type Spawnable } from "./Spawnable";

export class GravitonData implements Spawnable {
  constructor(
    public x: number,
    public y: number,
    public age: number,
    public lifespan: number
  ) {}
}
