import {
  StackingDamageBehavior,
  LifestealBehavior,
} from "../components/SkillBehavior.js";
import type { ISkillBehavior } from "../types/EntitiesTypes.js";

export const SkillRegistry: Record<string, (params: any) => ISkillBehavior> = {
  StackingDamage: (params) =>
    new StackingDamageBehavior(
      params.scale,
      params.baseStack,
      params.multiplier,
    ),
  Lifesteal: (params) =>
    new LifestealBehavior(params.scale, params.healPercent),
};
