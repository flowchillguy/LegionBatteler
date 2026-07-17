import type { Weapon } from "../entities/items/Weapon.js";
import type { IStatsCombat, TPosition } from "../types/EntitiesTypes.js";
import { StatsAdvanced } from "./StatsAdvanced.js";
import { StatsNormal } from "./StatsNormal.js";

export class StatsCombat {
  readonly position: TPosition;
  weapon: Weapon | null;
  atk: StatsNormal;
  hp: StatsNormal;
  def: StatsNormal;
  critRate: StatsAdvanced;
  critDamgage: StatsAdvanced;
  siege: StatsAdvanced;
  bonus: number;

  constructor(stats: IStatsCombat) {
    this.position = stats.position;
    this.weapon = stats.weapon;
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

  applyWeapon() {
    if (this.weapon) {
      this.weapon.checkPosition(this.position);
      this.atk.addBase(this.weapon.baseAtk);
      this.atk.applyMult([this.weapon.multAtk]);
      this.hp.applyMult([this.weapon.multHp]);
      this.def.applyMult([this.weapon.multDef]);
      this.critRate.applyFlat([this.weapon.addCritRate]);
      this.critDamgage.applyFlat([this.weapon.addCritDamage]);
      this.siege.applyFlat([this.weapon.addSiege]);
      this.applybonus([this.weapon.bonus]);
    }
  }

  caculateRawDamge(scale: number): number {
    const totalAtkCurrent = this.atk.calculateStatsTotal();
    return totalAtkCurrent * scale * (1 + this.bonus);
  }
}
