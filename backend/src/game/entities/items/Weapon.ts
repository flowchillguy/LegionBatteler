import type { IWeapon, TPosition } from "../../types/EntitiesTypes.js";

const EFFICIENCY_REDUCTION_FACTOR = 0.1;

export class Weapon {
  readonly id: string;
  readonly name: string;
  readonly position: TPosition;
  readonly cost: number;
  baseAtk: number;
  multAtk: number;
  multHp: number;
  multDef: number;
  addCritRate: number;
  addCritDamage: number;
  addSiege: number;
  bonus: number;

  constructor(statsWeapon: IWeapon) {
    this.id = statsWeapon.id;
    this.name = statsWeapon.name;
    this.position = statsWeapon.position;
    this.cost = statsWeapon.cost;
    this.baseAtk = statsWeapon.baseAtk;
    this.multAtk = statsWeapon.multAtk;
    this.multHp = statsWeapon.multHp;
    this.multDef = statsWeapon.multDef;
    this.addCritRate = statsWeapon.addCritRate;
    this.addCritDamage = statsWeapon.addCritDamage;
    this.addSiege = statsWeapon.addSiege;
    this.bonus = statsWeapon.bonus;
  }

  checkPosition(position: TPosition) {
    if (this.position !== position) {
      this.baseAtk = this.baseAtk * (1 - EFFICIENCY_REDUCTION_FACTOR);
      this.multAtk = this.multAtk * (1 - EFFICIENCY_REDUCTION_FACTOR);
      this.multHp = this.multHp * (1 - EFFICIENCY_REDUCTION_FACTOR);
      this.multDef = this.multDef * (1 - EFFICIENCY_REDUCTION_FACTOR);
      this.addCritRate = this.addCritRate * (1 - EFFICIENCY_REDUCTION_FACTOR);
      this.addCritDamage =
        this.addCritDamage * (1 - EFFICIENCY_REDUCTION_FACTOR);
      this.addSiege = this.addSiege * (1 - EFFICIENCY_REDUCTION_FACTOR);
      this.bonus = this.bonus * (1 - EFFICIENCY_REDUCTION_FACTOR);
    }
  }
}
