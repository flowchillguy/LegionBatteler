import type { TUnitId } from "../utilities/UnitFactory.js";
import type { Units } from "./Units.js";
import unitsConfig from "../data/units_config.json" with { type: "json" };
import type { ICharacterDatabase } from "../types/JsonTypes.js";
import {
  ALL_POSITIONS_OF_UNITS,
  type IBuffData,
  type TPosition,
} from "../types/EntitiesTypes.js";

const BASE_VALUE = 10;
const GROWTH_RATE = 1.2;
const ADD_VALUE = 0.6;

const database = unitsConfig as ICharacterDatabase;

export class DeckManager {
  countPosition = ALL_POSITIONS_OF_UNITS.reduce(
    (cp, pos) => {
      cp[pos] = 0;
      return cp;
    },
    {} as Record<TPosition, number>,
  );

  flatAtk = 0;
  flatHp = 0;
  flatDef = 0;

  addCritRate = 0;
  addCritDamage = 0;

  buffData: IBuffData = {};

  updateSynergy(unitIds: TUnitId[]) {
    for (const unitId of unitIds) {
      const position = database[unitId]?.info.position;
      if (!position) {
        throw new Error(`Không tìm thấy data cho unitId: ${unitId}`);
      }
      this.countPosition[position]++;
    }

    this.flatAtk = BASE_VALUE * GROWTH_RATE ** this.countPosition.Destroyer;
    this.flatHp = BASE_VALUE * GROWTH_RATE ** this.countPosition.Support;
    this.flatDef = BASE_VALUE * GROWTH_RATE ** this.countPosition.Defender;

    this.addCritRate = ADD_VALUE * this.countPosition.Fighter;
    this.addCritDamage = ADD_VALUE * this.countPosition.Archer;

    this.buffData = {
      flatAtk: this.flatAtk,
      flatHp: this.flatHp,
      flatDef: this.flatDef,
      addCritRate: this.addCritDamage,
      addCritDamage: this.addCritDamage,
    };
  }

  applyBuffSynergy(units: Units) {
    units.actionCombat.statsCombat.addBuff("synergy", this.buffData);
  }
}
