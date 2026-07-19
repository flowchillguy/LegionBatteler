import type { IWeapon, TPosition, TStar } from "../types/EntitiesTypes.js";
import type { Units } from "./Units.js";

const EFFICIENCY_REDUCTION_FACTOR = 0.1;

export class Weapon {
  readonly name: string;
  readonly position: TPosition;
  readonly cost: number;
  readonly star: TStar;
  baseAtk: number;
  multAtk: number;
  multHp: number;
  multDef: number;
  addCritRate: number;
  addCritDamage: number;
  addSiege: number;
  bonus: number;

  constructor(statsWeapon: IWeapon) {
    this.name = statsWeapon.name;
    this.position = statsWeapon.position;
    this.cost = statsWeapon.cost;
    this.star = statsWeapon.star;
    this.baseAtk = statsWeapon.baseAtk;
    this.multAtk = statsWeapon.multAtk;
    this.multHp = statsWeapon.multHp;
    this.multDef = statsWeapon.multDef;
    this.addCritRate = statsWeapon.addCritRate;
    this.addCritDamage = statsWeapon.addCritDamage;
    this.addSiege = statsWeapon.addSiege;
    this.bonus = statsWeapon.bonus;
  }

  // hàm kiểm tra có đúng position trang bị vũ khí không => đúng cộng chỉ số, sai cộng với chỉ số bị giảm theo EFFICIENCY_REDUCTION_FACTOR
  armed(units: Units) {
    const efficiencyFactor =
      this.position === units.position ? 1 : 1 - EFFICIENCY_REDUCTION_FACTOR;

    units.actionCombat.statsCombat.atk.addBase(this.baseAtk * efficiencyFactor);
    units.actionCombat.statsCombat.atk.applyMult([
      this.multAtk * efficiencyFactor,
    ]);
    units.actionCombat.statsCombat.hp.applyMult([
      this.multHp * efficiencyFactor,
    ]);
    units.actionCombat.statsCombat.def.applyMult([
      this.multDef * efficiencyFactor,
    ]);
    units.actionCombat.statsCombat.critRate.applyFlat([
      this.addCritRate * efficiencyFactor,
    ]);
    units.actionCombat.statsCombat.critDamgage.applyFlat([
      this.addCritDamage * efficiencyFactor,
    ]);
    units.actionCombat.statsCombat.siege.applyFlat([
      this.addSiege * efficiencyFactor,
    ]);
    units.actionCombat.statsCombat.applybonus([this.bonus * efficiencyFactor]);
  }
}
