import { type Spawnable } from "./spawnable";

/**
 * Structure for a graviton's data
 * Grouped with the other entities in GameData
 */
export class GravitonData implements Spawnable {
  age: number = 0;

  constructor(public x: number, public y: number) {}
}
