import type { ActionCombat } from "../../components/ActionCombat.js";
import { TargetSeeker } from "../../components/TargetSeeker.js";
import {
  COUNTER_MATRIX,
  type IDamageable,
  type ISkillBehavior,
  type ITargeting,
  type IUnits,
  type TLane,
  type TPosition,
  type TTeam,
  type TX,
} from "../../types/EntitiesTypes.js";

const DEFAULT_DEF_FACTOR = 100;

export class Units implements IDamageable {
  readonly id: string;
  readonly name: string;
  readonly cost: number;
  readonly cd: number; // thời gian giữa 2 lần được xuất thành

  readonly team: TTeam;
  readonly position: TPosition;
  x: TX;
  lane: TLane;

  targetSeeker: TargetSeeker;
  targetingNormal: ITargeting;
  targetingSkill: ITargeting;
  skillBehavior: ISkillBehavior;
  actionCombat: ActionCombat;

  moveSpeed: number;

  currentHp: number;

  constructor(data: IUnits) {
    this.id = data.id;
    this.name = data.name;
    this.cost = data.cost;
    this.cd = data.cd;
    this.team = data.team;
    this.position = data.position;
    this.x = data.x;
    this.lane = data.lane;
    this.targetSeeker = new TargetSeeker();
    this.targetingNormal = data.targetingNormal;
    this.targetingSkill = data.targetingSkill;
    this.skillBehavior = data.skillBehavior;
    this.moveSpeed = data.moveSpeed;
    this.actionCombat = data.actionCombat;
    this.currentHp = this.getMaxHp();
  }

  getMaxHp(): number {
    return Math.max(1, this.actionCombat.statsCombat.hp.calculateStatsTotal());
  }

  takeDamage(rawDamage: number): void {
    const defFactor =
      DEFAULT_DEF_FACTOR /
      (DEFAULT_DEF_FACTOR +
        this.actionCombat.statsCombat.def.calculateStatsTotal());
    const finalDamage = Math.max(1, rawDamage * defFactor);
    this.currentHp -= finalDamage;
  }

  isDead(): boolean {
    return this.currentHp <= 0;
  }
}
