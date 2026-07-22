import type { ILevelUp } from "../types/LevelUpTypes.js";
import type { TWeaponId } from "../utilities/WeaponFactory.js";
import type { Weapon } from "./Weapon.js";

const MAX_LEVEL = 3;

export class WeaponManager implements ILevelUp {
  level: number = 0;
  weaponDepot: Map<TWeaponId, Weapon> = new Map();

  lvUp() {
    if (this.level < MAX_LEVEL) {
      this.level++;
    }
  }

  // 

  // mua và bán vũ khí
}
