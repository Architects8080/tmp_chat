import { Position } from './position.data';
import { Vector } from './vector.data';

export class GameObject {
  position: Position;
  vector: Vector;

  constructor() {
    this.position = new Position();
    this.vector = new Vector();
  }
}
