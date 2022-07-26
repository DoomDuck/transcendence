import { type Spawnable } from "./Spawnable";

/**
 * Structure for a graviton's data
 * Grouped with the other entities in GameData
 */
export class GravitonData implements Spawnable {
  constructor(
    public x: number,
    public y: number,
    public age: number,
    public lifespan: number
  ) {}
}
