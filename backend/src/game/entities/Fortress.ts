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

export class Fortress implements IDamageable {
  public team: TTeam;
  public position: TPosition = "Fortress";
  public x: TX;
  private currentHp: number = DEFAULT_HP;
  private readonly def: number = DEFAULT_DEF;
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

  levelUp() {
    if (this.level < 5) {
      this.currentHp += HP_HEAL_WHEN_LV_UP;
      this.level += 1;
    }
  }
}
