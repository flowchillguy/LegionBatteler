import type { ISkillBehavior, SkillContext } from "../types/EntitiesTypes.js";

export type TSkillBehaviorType = "StackingDamage" | "Lifesteal";

// Càng đánh càng đau
export class StackingDamageBehavior implements ISkillBehavior {
  private scale: number;
  private baseStack: number;
  private multiplier: number;

  // Tham số này lấy từ JSON truyền vào
  constructor(scale: number, baseStack: number, multiplier: number) {
    this.scale = scale;
    this.baseStack = baseStack;
    this.multiplier = multiplier;
  }

  execute(context: SkillContext) {
    let currentStack = this.baseStack;
    const rawDamage = context.caster.actionCombat.statsCombat.caculateRawDamge(
      this.scale,
    );

    for (const enemy of context.targets) {
      enemy.takeDamage(rawDamage * currentStack);
      currentStack *= this.multiplier;
    }
  }
}

// Hút máu
export class LifestealBehavior implements ISkillBehavior {
  private scale: number;
  private healPercent: number; // Ví dụ 0.2 (20%)

  constructor(scale: number, healPercent: number) {
    this.healPercent = healPercent;
    this.scale = scale;
  }

  execute(context: SkillContext) {
    const rawDamage = context.caster.actionCombat.statsCombat.caculateRawDamge(
      this.scale,
    );
    let totalDamageDealt = 0;

    for (const enemy of context.targets) {
      enemy.takeDamage(rawDamage);
      totalDamageDealt += rawDamage;
    }

    // Hồi máu cho bản thân
    const healAmount = totalDamageDealt * this.healPercent;
    context.caster.getHeal(healAmount); // Giả sử IDamageable có hàm heal()
  }
}
