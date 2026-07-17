import type { ActionCombat } from "../components/ActionCombat.js";
import type { StatsAdvanced } from "../components/StatsAdvanced.js";
import type { StatsNormal } from "../components/StatsNormal.js";
import type { TargetSeeker } from "../components/TargetSeeker.js";
import type { Weapon } from "../entities/items/Weapon.js";

export const COUNTER_MATRIX: Record<string, Record<string, number>> = {
  Marksman: {
    Defender: 1.1,
    Breaker: 0.95,
  },
  Defender: {
    Fighter: 1.1,
    Marksman: 0.95,
  },
  Fighter: {
    Breaker: 1.1,
    Defender: 0.95,
  },
  Breaker: {
    Marksman: 1.1,
    Fighter: 0.95,
  },
  Supporter: {},
};

export type TTeam = "left" | "right";
export type TPosition =
  | "Marksman"
  | "Defender"
  | "Support"
  | "Fighter"
  | "Destroyer"
  | "Fortress";

// 0 và 10 là tọa độ 2 fortress trái và phải
export type TX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type TLane = 0 | 1 | 2 | 3 | 4;

export type TTargetConfig = "enemy" | "ally";

export interface IDamageable {
  team: TTeam;
  position: TPosition;
  x: TX; // Bắt buộc phải có trục X để tính khoảng cách
  lane?: TLane; // Optional (có thể có hoặc không), vì Thành chiếm toàn bộ chiều dọc sân đấu
  takeDamage(rawDamage: number): void;
  isDead(): boolean;
}

export interface IWeapon {
  id: string;
  name: string;
  cost: number;
  position: TPosition;
  baseAtk: number;
  multAtk: number;
  multHp: number;
  multDef: number;
  addCritRate: number;
  addCritDamage: number;
  addSiege: number;
  bonus: number;
}

export interface IStatsCombat {
  position: TPosition;
  weapon: Weapon | null;
  atk: StatsNormal;
  hp: StatsNormal;
  def: StatsNormal;
  critRate: StatsAdvanced;
  critDamgage: StatsAdvanced;
  siege: StatsAdvanced;
  bonus: number;
}

export interface ISkillBehavior {
  execute(
    statsCombat: IStatsCombat,
    scaleSkill: number,
    targets: IDamageable[],
  ): void;
}

export interface ITargeting {
  config: TTargetConfig;
  rangeX: number;
  laneSpread: number; // Đánh lan nhiều hàng
  pierce: boolean; // đánh xuyên nhiều mục tiêu
  maxTargets: number;
}

export interface IUnits {
  id: string;
  name: string;
  cost: number;
  cd: number;
  team: TTeam;
  position: TPosition;
  x: TX;
  lane: TLane;
  targetSeeker: TargetSeeker;
  targetingNormal: ITargeting;
  targetingSkill: ITargeting;
  skillBehavior: ISkillBehavior;
  actionCombat: ActionCombat;
  moveSpeed: number;
  currentHp: number;
}
