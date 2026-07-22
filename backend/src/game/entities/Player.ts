import type { TTeam } from "../types/EntitiesTypes.js";
import type { ILevelUp, TTypeLvUp } from "../types/LevelUpTypes.js";
import type { TUnitId } from "../utilities/UnitFactory.js";
import { DeckManager } from "./DeckManager.js";
import { Fortress } from "./Fortress.js";
import { GoldManager } from "./GoldManager.js";
import type { Weapon } from "./Weapon.js";
import { WeaponManager } from "./WeaponManager.js";

// giá level up
const PRICE_LIST_LEVEL_UP = {
  gold: [5, 0.2],
  fortress: [1, 0.5],
  units: [4, 0.1],
  weapon: [3, 0.4],
};

export class Player {
  goldManager: GoldManager = new GoldManager();
  fortress: Fortress;
  deckManager: DeckManager = new DeckManager();
  selectedUnitId: TUnitId[];
  weaponManager: WeaponManager = new WeaponManager();
  // Quản lý units

  constructor(team: TTeam, selectedUnitId: TUnitId[]) {
    this.fortress = new Fortress(team);
    this.selectedUnitId = selectedUnitId;
    8;
  }

  //============================================================//
  // LÊN LEVEL
  private typeLevelUp(type: TTypeLvUp): ILevelUp {
    switch (type) {
      case "fortress":
        return this.fortress;
      case "gold":
        return this.goldManager;
      case "units":
        return this.deckManager;
      case "weapon":
        return this.weaponManager;
    }
  }

  // Tương tác 1 (nâng cấp thành/lính/vàng)
  upLevel(type: TTypeLvUp): boolean {
    const typeLvUp = this.typeLevelUp(type);
    const currentLevel = typeLvUp.level;
    const cost_base = PRICE_LIST_LEVEL_UP[type][0] ?? 5;
    const cost_factor = PRICE_LIST_LEVEL_UP[type][1] ?? 0.2;
    const cost = cost_base + (1 + cost_factor) ** currentLevel;

    if (this.goldManager.deductGold(cost)) {
      typeLvUp.lvUp();
      return true;
    }
    return false;
  }

  // Tương tác 2 mua/bán vũ khí và trang bị vũ khí đã mua

  // Tương tác 3 thả lính
}
