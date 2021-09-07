export class Vector {
  dx: number;
  dy: number;

  constructor(dx?: number, dy?: number) {
    this.dx = 0;
    this.dy = 0;
    if (dx != undefined) this.dx = dx;
    if (dy != undefined) this.dy = dy;
  }
}
