import type { ActionCombat } from "../components/ActionCombat.js";
import type { StatsAdvanced } from "../components/StatsAdvanced.js";
import type { StatsNormal } from "../components/StatsNormal.js";
import type { TargetSeeker } from "../components/TargetSeeker.js";
import type { Weapon } from "../entities/Weapon.js";
import { Units } from "../entities/Units.js";

export const COUNTER_MATRIX: Record<string, Record<string, number>> = {
  Archer: {
    Defender: 1.1,
    Breaker: 0.95,
  },
  Defender: {
    Fighter: 1.1,
    Archer: 0.95,
  },
  Fighter: {
    Breaker: 1.1,
    Defender: 0.95,
  },
  Breaker: {
    Archer: 1.1,
    Fighter: 0.95,
  },
  Supporter: {},
};

export type TTeam = "left" | "right";
export type TPosition =
  | "Archer"
  | "Defender"
  | "Support"
  | "Fighter"
  | "Destroyer"
  | "Fortress";

export const ALL_POSITIONS_OF_UNITS: TPosition[] = [
  "Archer",
  "Defender",
  "Support",
  "Fighter",
  "Destroyer",
];

// 0 và 10 là tọa độ 2 fortress trái và phải
export type TX = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type TLane = 0 | 1 | 2 | 3 | 4;
export type TTargetConfig = "enemy" | "ally";
export type TStar = 1 | 2 | 3;

export interface IDamageable {
  team: TTeam;
  position: TPosition;
  x: TX; // Bắt buộc phải có trục X để tính khoảng cách
  lane?: TLane; // Optional (có thể có hoặc không), vì Thành chiếm toàn bộ chiều dọc sân đấu
  takeDamage(rawDamage: number): void;
  isDead(): boolean;
}

export interface IWeapon {
  name: string;
  cost: number;
  position: TPosition;
  star: TStar;

  buffData: IBuffData;
}

export interface IStatsCombat {
  weapon: Weapon[] | null;
  atk: StatsNormal;
  hp: StatsNormal;
  def: StatsNormal;
  critRate: StatsAdvanced;
  critDamage: StatsAdvanced;
  siege: StatsAdvanced;
  bonus: StatsAdvanced;
}

export interface SkillContext {
  caster: Units;
  targets: IDamageable[];
}

export interface ISkillBehavior {
  execute(context: SkillContext): void;
}

export interface ITargeting {
  config: TTargetConfig;
  rangeX: number;
  laneSpread: number; // Đánh lan nhiều hàng
  maxTargets: number;
}

export interface IUnits {
  name: string;
  cost: number;
  spawnCd: number;
  position: TPosition;
  moveSpeed: number;
  team: TTeam;
  x: TX;
  lane: TLane;
  targetSeeker: TargetSeeker;
  normalTargeting: ITargeting;
  skillTargeting: ITargeting;
  actionCombat: ActionCombat;
}

export interface IBuffData {
  baseAtk?: number;
  multAtk?: number;
  flatAtk?: number;

  multHp?: number;
  flatHp?: number;

  multDef?: number;
  flatDef?: number;

  addCritRate?: number;
  addCritDamage?: number;
  
  addSiege?: number;
  bonus?: number;
}
