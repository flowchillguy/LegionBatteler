// file: types/JsonTypes.ts
import type { TPosition, ITargeting, TStar, IBuffData } from "./EntitiesTypes.js";
import type { TSkillBehaviorType } from "../components/SkillBehavior.js";

export interface ICharacterInfo {
  name: string;
  cost: number;
  spawnCd: number;
  moveSpeed: number;
  position: TPosition;
}

export interface ITargetingConfig {
  normal: ITargeting;
  skill: ITargeting;
  [key: string]: ITargeting;
}

export interface ICombatConfig {
  attackSpeed: number;
  cdSkill: number;
  scaleNormal: number;
}

export interface ICharacterStats {
  hp: number;
  atk: number;
  def: number;
  critRate: number;
  critDamage: number;
  siege: number;
  bonus: number;
}

export interface ISkillBehaviorConfig {
  type: TSkillBehaviorType;
  params: Record<string, number>;
}

export interface ICharacterAssets {
  move: string;
  attack_normal: string;
  attack_skill: string;
  sfx_attack: string;
  sfx_skill: string;
}

export interface ICharacterData {
  info: ICharacterInfo;
  targeting: ITargetingConfig;
  combat: ICombatConfig;
  stats: ICharacterStats;
  skillBehaviors: ISkillBehaviorConfig[];
  assets: ICharacterAssets;
}

export interface ICharacterDatabase {
  [characterId: string]: ICharacterData;
}

// vũ khí
export interface IWeaponInfo {
  name: string;
  position: TPosition;
  cost: number;
  star: TStar;
}

export interface IWeaponData {
  info: IWeaponInfo;
  stats: IBuffData;
}

export interface IweaponDataBase {
  [weaponId: string]: IWeaponData;
}
