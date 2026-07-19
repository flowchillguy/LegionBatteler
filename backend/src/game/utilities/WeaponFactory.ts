import weaponConfig from "../data/weapon_config.json" with { type: "json" };
import { Weapon } from "../entities/Weapon.js";
import type { IweaponDataBase } from "../types/JsonTypes.js";

const database = weaponConfig as IweaponDataBase;
type TWeaponId = keyof typeof weaponConfig;

export class WeaponFactory {
  static createWeapon(weaponId: TWeaponId): Weapon {
    const config = database[weaponId];

    if (!config)
      throw new Error(`Không tìm thấy data cho weaponId: ${weaponId}`);

    const { info, stats } = config;

    const statsWeapon = {
      name: info.name,
      position: info.position,
      cost: info.cost,
      star: info.star,
      baseAtk: stats.baseAtk,
      multAtk: stats.multAtk,
      multHp: stats.multHp,
      multDef: stats.multDef,
      addCritRate: stats.addCritRate,
      addCritDamage: stats.addCritDamage,
      addSiege: stats.addSiege,
      bonus: stats.bonus,
    };

    return new Weapon(statsWeapon);
  }

  static createAllWeapon(): Record<TWeaponId, Weapon> {
    const weaponsDepot = {} as Record<TWeaponId, Weapon>;
    const weaponIds = Object.keys(database) as TWeaponId[];
    for (const weaponId of weaponIds) {
      weaponsDepot[weaponId] = this.createWeapon(weaponId);
    }
    return weaponsDepot;
  }
}
