export class StatsNormal {
  readonly base: number;
  readonly mult: number = 0;
  readonly flat: number = 0;

  currentBase: number;
  currentMult: number = 0;
  currentFlat: number = 0;

  constructor(base: number) {
    this.base = base;
    this.currentBase = base;
  }

  addBase(n: number) {
    this.currentBase += n;
  }

  applyMult(value: number) {
    this.currentMult += value;
  }

  applyFlat(value: number) {
    this.currentFlat += value;
  }

  resetStats(): void {
    this.currentBase = this.base;
    this.currentFlat = this.flat;
    this.currentMult = this.mult;
  }

  calculateCurrentStatsTotal(): number {
    return this.currentBase * (1 + this.currentMult) + this.currentFlat;
  }
}
