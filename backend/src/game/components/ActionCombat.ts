import type { IDamageable, ISkillBehavior } from "../types/EntitiesTypes.js";
import type { StatsCombat } from "./StatsCombat.js";

export class ActionCombat {
  statsCombat: StatsCombat;
  private attackSpeed: number; // Số đòn / giây
  private cdSkill: number; // Số giây / đòn
  private scaleNormal: number;
  private scaleSkill: number;
  private skillBehavior: ISkillBehavior[];

  // Bộ đếm
  private attackTimer: number = 0;
  private skillTimer: number = 0;

  constructor(
    statsCombat: StatsCombat,
    attackSpeed: number,
    cdSkill: number,
    scaleNormal: number,
    scaleSkill: number,
    skillBehavior: ISkillBehavior[],
  ) {
    this.statsCombat = statsCombat;
    this.attackSpeed = attackSpeed;
    this.cdSkill = cdSkill;
    this.scaleNormal = scaleNormal;
    this.scaleSkill = scaleSkill;
    this.skillBehavior = skillBehavior;
  }

  update(deltaTime: number, targets: IDamageable[]): void {
    this.attackTimer += deltaTime;
    this.skillTimer += deltaTime;

    if (targets.length === 0) return;

    // skill first
    if (this.skillTimer >= this.cdSkill) {
      this.castSkill(targets);
      this.skillTimer -= this.cdSkill;
      this.attackTimer = 0;
    }

    const timeBetweenAttacks = 1 / this.attackSpeed;

    if (this.attackTimer >= timeBetweenAttacks) {
      this.autoAttack(targets);
      this.attackTimer -= timeBetweenAttacks;
    }
  }

  private autoAttack(targets: IDamageable[]): void {
    const rawDamage = this.statsCombat.caculateRawDamge(this.scaleNormal);
    for (const enemy of targets) {
      enemy.takeDamage(rawDamage);
    }
  }

  private castSkill(targets: IDamageable[]): void {
    for (const behavior of this.skillBehavior) {
      behavior.execute(this.statsCombat, this.scaleSkill, targets);
    }
  }
}
