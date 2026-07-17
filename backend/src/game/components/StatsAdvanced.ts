export class StatsAdvanced {
  readonly base: number;
  flat: number = 0;

  constructor(base: number) {
    this.base = base;
  }

  applyFlat(values: number[]): void {
    this.flat = values.reduce((total, num) => total + num, this.flat);
  }

  calculateStatsTotal(): number {
    return this.base + this.flat;
  }
}
