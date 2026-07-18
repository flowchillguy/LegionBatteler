// file: factories/UnitFactory.ts
import unitsConfig from "../data/units_config.json" with { type: "json" };
import { ActionCombat } from "../components/ActionCombat.js";
import { TargetSeeker } from "../components/TargetSeeker.js";
import { SkillRegistry } from "./SkillRegistry.js";
import { Units } from "../entities/Units.js";

import type {
  TLane,
  TTeam,
  TX,
  ISkillBehavior,
  IStatsCombat,
} from "../types/EntitiesTypes.js";
import type { ICharacterData, ICharacterDatabase } from "../types/JsonTypes.js";
import { StatsCombat } from "../components/StatsCombat.js";
import { StatsNormal } from "../components/StatsNormal.js";
import { StatsAdvanced } from "../components/StatsAdvanced.js";

export class UnitFactory {
  static createUnit(
    unitId: keyof typeof unitsConfig,
    team: TTeam,
    lane: TLane,
    x: TX,
  ): Units {
    const database = unitsConfig as ICharacterDatabase;
    const config = database[unitId];

    if (!config) {
      throw new Error(`Không tìm thấy data cho unitId: ${unitId}`);
    }

    const { info, targeting, stats, combat, skillBehaviors } = config;

    const targetSeeker = new TargetSeeker();
    const normalTargeting = targeting.normal;
    const skillTargeting = targeting.skill;

    const statsData = {
      weapon: null,
      atk: new StatsNormal(stats.atk),
      hp: new StatsNormal(stats.hp),
      def: new StatsNormal(stats.def),
      critRate: new StatsAdvanced(stats.critRate),
      critDamgage: new StatsAdvanced(stats.critDamage),
      siege: new StatsAdvanced(stats.siege),
      bonus: 0,
    };
    const statsCombat = new StatsCombat(statsData);

    const skillBehavior: ISkillBehavior[] = skillBehaviors.map(
      (behaviorData) => {
        const creatorFunc = SkillRegistry[behaviorData.type];
        if (!creatorFunc) {
          throw new Error(
            `Skill chưa đăng ký trong Registry: ${behaviorData.type}`,
          );
        }
        // Khởi tạo behavior instance từ params trong JSON
        return creatorFunc(behaviorData.params);
      },
    );

    const actionCombat = new ActionCombat(
      statsCombat,
      combat.attackSpeed,
      combat.cdSkill,
      combat.scaleNormal,
      skillBehavior,
    );

    const dataUnit = {
      name: info.name,
      cost: info.cost,
      spawnCd: info.spawnCd,
      position: info.position,
      moveSpeed: info.moveSpeed,
      team,
      x,
      lane,
      targetSeeker,
      normalTargeting,
      skillTargeting,
      actionCombat,
    };

    return new Units(dataUnit);
  }
}
