import type { TUnitId } from "../utilities/UnitFactory.js";
import type { Units } from "./Units.js";
import unitsConfig from "../data/units_config.json" with { type: "json" };
import type { ICharacterDatabase } from "../types/JsonTypes.js";
import {
  ALL_POSITIONS_OF_UNITS,
  type IBuffData,
  type TPosition,
} from "../types/EntitiesTypes.js";
import type { ILevelUp } from "../types/LevelUpTypes.js";

// chỉ số cộng hưởng
const BASE_VALUE = 10;
const GROWTH_RATE = 1.2;
const ADD_VALUE = 0.6;

// chỉ số level
const MAX_LEVEL = 5;
const BASE_BUFF_LEVEL_DATA = {
  baseAtk: 5,
  multHp: 0.05,
  multDef: 0.05,
};

const database = unitsConfig as ICharacterDatabase;

export class DeckManager implements ILevelUp {
  countPosition = ALL_POSITIONS_OF_UNITS.reduce(
    (cp, pos) => {
      cp[pos] = 0;
      return cp;
    },
    {} as Record<TPosition, number>,
  );

  buffData: IBuffData = {};
  level: number = 0;

  updateSynergy(unitIds: TUnitId[]) {
    for (const unitId of unitIds) {
      const position = database[unitId]?.info.position;
      if (!position) {
        throw new Error(`Không tìm thấy data cho unitId: ${unitId}`);
      }
      this.countPosition[position]++;
    }

    const flatAtk = BASE_VALUE * GROWTH_RATE ** this.countPosition.Destroyer;
    const flatHp = BASE_VALUE * GROWTH_RATE ** this.countPosition.Support;
    const flatDef = BASE_VALUE * GROWTH_RATE ** this.countPosition.Defender;

    const addCritRate = ADD_VALUE * this.countPosition.Fighter;
    const addCritDamage = ADD_VALUE * this.countPosition.Archer;

    this.buffData = {
      flatAtk,
      flatHp,
      flatDef,
      addCritRate,
      addCritDamage,
    };
  }

  private getBuffData(level: number) {
    return Object.fromEntries(
      Object.entries(BASE_BUFF_LEVEL_DATA).map(([key, value]) => [
        key,
        value * level,
      ]),
    );
  }

  applyBuffSynergy(units: Units) {
    units.actionCombat.statsCombat.addBuff("synergy", this.buffData);
  }

  applyBuffLevel(units: Units) {
    if (this.level < MAX_LEVEL) {
      units.actionCombat.statsCombat.addBuff(
        `level_${this.level}_buff`,
        this.getBuffData(this.level),
      );
    }
  }

  lvUp() {
    if (this.level < MAX_LEVEL) {
      this.level++;
    }
  }
}
