import { WeaponFactory, type TWeaponId } from "../utilities/WeaponFactory.js";
import type { Player } from "./Player.js";
import { Weapon } from "./Weapon.js";

const LIMIT_POINT_1_STAR = 3;
const LIMIT_POINT_2_STAR = 5;
const LIMIT_POINT_3_STAR = 9;
const POINT_LIMIT_MAX = 60;

export class ShopWeapon {
  private availableWeapons: Map<TWeaponId, Weapon> =
    WeaponFactory.createAllWeapon();

  // mua
  buyWeapon(player: Player, weaponId: TWeaponId): boolean {
    const weapon = this.availableWeapons.get(weaponId);
    if (!weapon) {
      console.log(
        `Vũ khí ${weaponId} không có sẵn hoặc đã được người khác mua!`,
      );
      return false;
    }

    player.weaponDepot.set(weaponId, weapon);
    this.availableWeapons.delete(weaponId);

    console.log(`Player ${player.fortress.team} đã mua thành công ${weaponId}`);
    return true;
  }

  // bán
  sellWeapon(player: Player, weaponId: TWeaponId): boolean {
    const weapon = player.weaponDepot.get(weaponId);
    if (!weapon) {
      console.log(
        `Player ${player.fortress.team} không sở hữu vũ khí ${weaponId} để bán!`,
      );
      return false;
    }

    player.weaponDepot.delete(weaponId);
    this.availableWeapons.set(weaponId, weapon);

    console.log(
      `Player ${player.fortress.team} đã bán lại ${weaponId} cho Shop`,
    );
    return true;
  }

  // check còn hàng không?
  getAvailableWeapons(): ReadonlyMap<TWeaponId, Weapon> {
    return this.availableWeapons;
  }
}
