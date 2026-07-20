import weaponConfig from "../data/weapon_config.json" with { type: "json" };
import { Weapon } from "../entities/Weapon.js";
import type { IBuffData } from "../types/EntitiesTypes.js";
import type { IweaponDataBase } from "../types/JsonTypes.js";

const database = weaponConfig as IweaponDataBase;
type TWeaponId = keyof typeof weaponConfig;

export class WeaponFactory {
  static createWeapon(weaponId: TWeaponId): Weapon {
    const config = database[weaponId];

    if (!config)
      throw new Error(`Không tìm thấy data cho weaponId: ${weaponId}`);

    const { info, stats } = config;

    const buffData: Partial<IBuffData> = {};

    const statKeys: (keyof IBuffData)[] = [
      "baseAtk",
      "multAtk",
      "flatAtk",
      "multHp",
      "flatHp",
      "multDef",
      "flatDef",
      "addCritRate",
      "addCritDamage",
      "addSiege",
      "bonus",
    ];

    for (const key of statKeys) {
      const value = stats[key];
      if (value !== undefined) {
        buffData[key] = value;
      }
    }

    const statsWeapon = {
      name: info.name,
      cost: info.cost,
      position: info.position,
      star: info.star,

      buffData: buffData,
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

console.log(WeaponFactory.createAllWeapon());
