import type {
  IBuffData,
  IWeapon,
  TPosition,
  TStar,
} from "../types/EntitiesTypes.js";
import type { Units } from "./Units.js";

const EFFICIENCY_REDUCTION_FACTOR = 0.1;

export class Weapon {
  readonly name: string;
  readonly position: TPosition;
  readonly cost: number;
  readonly star: TStar;
  buffData: IBuffData;

  constructor(statsWeapon: IWeapon) {
    this.name = statsWeapon.name;
    this.position = statsWeapon.position;
    this.cost = statsWeapon.cost;
    this.star = statsWeapon.star;
    this.buffData = statsWeapon.buffData;
  }

  // hàm kiểm tra có đúng position trang bị vũ khí không => đúng cộng chỉ số, sai cộng với chỉ số bị giảm theo EFFICIENCY_REDUCTION_FACTOR
  armed(units: Units) {
    const efficiencyFactor =
      this.position === units.position ? 1 : 1 - EFFICIENCY_REDUCTION_FACTOR;

    let effectiveBuff: IBuffData = { ...this.buffData };
    if (efficiencyFactor !== 1) {
      for (const key in effectiveBuff) {
        const k = key as keyof IBuffData;
        if (effectiveBuff[k] !== undefined) {
          effectiveBuff[k] = (effectiveBuff[k] as number) * efficiencyFactor;
        }
      }
    }

    units.actionCombat.statsCombat.addBuff(
      `weapon_${this.name}`,
      effectiveBuff,
    );
  }
}
