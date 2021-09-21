export class Position {
  x: number;
  y: number;

  constructor(x?: number, y?: number) {
    this.x = 0;
    this.y = 0;
    if (x != undefined) this.x = x;
    if (y != undefined) this.y = y;
  }
}
