import type { Weapon } from "../entities/Weapon.js";
import type { IStatsCombat, TPosition } from "../types/EntitiesTypes.js";
import { StatsAdvanced } from "./StatsAdvanced.js";
import { StatsNormal } from "./StatsNormal.js";

export class StatsCombat {
  weapon: Weapon | null;
  atk: StatsNormal;
  hp: StatsNormal;
  def: StatsNormal;
  critRate: StatsAdvanced;
  critDamgage: StatsAdvanced;
  siege: StatsAdvanced;
  bonus: number;

  constructor(stats: IStatsCombat) {
    this.weapon = stats.weapon ?? null;
    this.atk = stats.atk;
    this.hp = stats.hp;
    this.def = stats.def;
    this.critRate = stats.critRate;
    this.critDamgage = stats.critDamgage;
    this.siege = stats.siege;
    this.bonus = stats.bonus;
  }

  applybonus(values: number[]) {
    this.bonus = values.reduce((total, num) => total + num, this.bonus);
  }

  isCrit(): boolean {
    return Math.random() <= this.critRate.calculateStatsTotal();
  }

  caculateRawDamge(scale: number): number {
    const totalAtkCurrent = this.atk.calculateStatsTotal();
    const rawDamage = totalAtkCurrent * scale * (1 + this.bonus);
    if (this.isCrit()) {
      return rawDamage * (1 + this.critDamgage.calculateStatsTotal());
    }
    return rawDamage;
  }
}
