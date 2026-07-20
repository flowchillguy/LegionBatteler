export class StatsAdvanced {
  readonly base: number;
  currentStats: number;

  constructor(base: number) {
    this.base = base;
    this.currentStats = base;
  }

  applyStats(value: number): void {
    this.currentStats += value;
  }

  resetStats(): void {
    this.currentStats = this.base;
  }
}
