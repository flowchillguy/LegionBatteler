import type {
  IDamageable,
  TPosition,
  TTeam,
  TX,
} from "../types/EntitiesTypes.js";

const DEFAULT_HP = 10000;
const DEFAULT_DEF = 1000;
const DEFAULT_DEF_FACTOR = 100;
const HP_HEAL_WHEN_LV_UP = 1000;
const MAX_LEVEL = 5;

export class Fortress implements IDamageable {
  team: TTeam;
  position: TPosition = "Fortress";
  x: TX;
  maxHp: number = DEFAULT_HP;
  currentHp: number = DEFAULT_HP;
  readonly def: number = DEFAULT_DEF;
  level: number = 0;

  constructor(team: TTeam) {
    this.team = team;
    this.x = team === "left" ? 0 : 10;
  }

  takeDamage(rawDamage: number): void {
    const defFactor = DEFAULT_DEF_FACTOR / (DEFAULT_DEF_FACTOR + this.def);
    const finalDamage = Math.max(1, rawDamage * defFactor);
    this.currentHp -= finalDamage;
  }

  isDead(): boolean {
    return this.currentHp <= 0;
  }

  levelUp(): void {
    if (this.level < MAX_LEVEL) {
      this.currentHp += HP_HEAL_WHEN_LV_UP;
      this.level++;
    }
  }
}
