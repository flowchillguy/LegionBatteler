import type { Units } from "../entities/Units.js";
import {
  COUNTER_MATRIX,
  type IDamageable,
  type ISkillBehavior,
  type TPosition,
} from "../types/EntitiesTypes.js";
import type { StatsCombat } from "./StatsCombat.js";

export class ActionCombat {
  statsCombat: StatsCombat;
  private attackSpeed: number; // Số đòn / giây
  private cdSkill: number; // Số giây / đòn
  private scaleNormal: number;
  private skillBehavior: ISkillBehavior[];

  // Bộ đếm
  private attackTimer: number = 0;
  private skillTimer: number = 0;

  constructor(
    statsCombat: StatsCombat,
    attackSpeed: number,
    cdSkill: number,
    scaleNormal: number,
    skillBehavior: ISkillBehavior[],
  ) {
    this.statsCombat = statsCombat;
    this.attackSpeed = attackSpeed;
    this.cdSkill = cdSkill;
    this.scaleNormal = scaleNormal;
    this.skillBehavior = skillBehavior;
  }

  updateTimers(deltaTime: number): void {
    this.attackTimer += deltaTime;
    this.skillTimer += deltaTime;
  }

  isSkillReady(): boolean {
    return this.skillTimer >= this.cdSkill;
  }

  isNormalReady(): boolean {
    const timeBetweenAttacks = 1 / this.attackSpeed;
    return this.attackTimer >= timeBetweenAttacks;
  }

  castSkill(targets: IDamageable[], caster: Units): void {
    if (targets.length === 0) return;

    for (const behavior of this.skillBehavior) {
      behavior.execute({ caster, targets });
    }

    // Reset timer
    this.skillTimer = 0;
    this.attackTimer = 0; // Reset đòn đánh thường vì đang tung skill
  }

  autoAttack(targets: IDamageable[], position: TPosition): void {
    if (targets.length === 0) return;

    const rawDamage = this.statsCombat.caculateRawDamge(this.scaleNormal);
    for (const enemy of targets) {
      if (enemy.position === "Fortress") {
        enemy.takeDamage(
          rawDamage * (1 + this.statsCombat.siege.calculateStatsTotal()),
        );
        continue;
      }

      const counterFactor = COUNTER_MATRIX[position]?.[enemy.position] ?? 1;
      enemy.takeDamage(rawDamage * counterFactor);
    }

    // Reset timer
    const timeBetweenAttacks = 1 / this.attackSpeed;
    this.attackTimer -= timeBetweenAttacks;
  }
}
