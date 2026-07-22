import weaponConfig from "../data/weapon_config.json" with { type: "json" };
import { Weapon } from "../entities/Weapon.js";
import type { IBuffData } from "../types/EntitiesTypes.js";
import type { IweaponDataBase } from "../types/JsonTypes.js";

const database = weaponConfig as IweaponDataBase;
export type TWeaponId = keyof typeof weaponConfig;

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

  // Chuyển Return Type thành Map<TWeaponId, Weapon>
  static createAllWeapon(): Map<TWeaponId, Weapon> {
    const weaponIds = Object.keys(database) as TWeaponId[];

    return new Map(weaponIds.map((id) => [id, this.createWeapon(id)]));
  }
}
