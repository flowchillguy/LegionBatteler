import type {
  IDamageable,
  TPosition,
  TTeam,
  TX,
} from "../types/EntitiesTypes.js";

const DEFAULT_HP = 5000;
const DEFAULT_DEF = 1000;
const DEFAULT_DEF_FACTOR = 100;

export class Fortress implements IDamageable {
  public team: TTeam;
  public position: TPosition = "Fortress";
  public x: TX;
  private hp: number = DEFAULT_HP;
  private readonly def: number = DEFAULT_DEF;

  constructor(team: TTeam) {
    this.team = team;
    this.x = team === "left" ? 0 : 10;
  }

  public takeDamage(rawDamage: number): void {
    const defFactor = DEFAULT_DEF_FACTOR / (DEFAULT_DEF_FACTOR + this.def);
    const finalDamage = Math.max(1, rawDamage * defFactor);
    this.hp -= finalDamage;
  }

  public isDead(): boolean {
    return this.hp <= 0;
  }
}
