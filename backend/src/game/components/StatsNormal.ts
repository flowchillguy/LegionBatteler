export class StatsNormal {
  base: number;
  mult: number = 0;
  flat: number = 0;

  constructor(base: number) {
    this.base = base;
  }

  addBase(n: number) {
    this.base += n;
  }

  applyMult(values: number[]) {
    this.mult = values.reduce((total, num) => total + num, this.mult);
  }

  applyFlat(values: number[]) {
    this.flat = values.reduce((total, num) => total + num, this.flat);
  }

  calculateStatsTotal(): number {
    return this.base * (1 + this.mult) + this.flat;
  }
}
