import type { IDamageable, ITargeting } from "../types/EntitiesTypes.js";

export type TargetResult =
  | { action: "skill"; targets: IDamageable[] }
  | { action: "normal"; targets: IDamageable[] }
  | { action: "move"; targets: [] };

export class TargetSeeker {
  // Hàm public duy nhất mà class cha sẽ gọi
  execute(
    actor: IDamageable,
    allUnitsInGame: IDamageable[],
    normalTargeting: ITargeting,
    skillTargeting: ITargeting, // Có thể unit chưa có skill
    isSkillReady: boolean, // Class cha truyền vào trạng thái cooldown của skill
  ): TargetResult {
    // 1. Ưu tiên kiểm tra Skill trước
    if (skillTargeting && isSkillReady) {
      const skillTargets = this.findTargets(
        actor,
        allUnitsInGame,
        skillTargeting,
      );
      if (skillTargets.length > 0) {
        return { action: "skill", targets: skillTargets };
      }
    }

    // 2. Nếu Skill không có mục tiêu (hoặc đang cooldown), kiểm tra đánh Normal
    const normalTargets = this.findTargets(
      actor,
      allUnitsInGame,
      normalTargeting,
    );
    if (normalTargets.length > 0) {
      return { action: "normal", targets: normalTargets };
    }

    // 3. Không có mục tiêu nào lọt vào cả 2 tầm đánh -> Tiến lên
    return { action: "move", targets: [] };
  }

  // Hàm private chứa core logic
  private findTargets(
    actor: IDamageable,
    allUnitsInGame: IDamageable[],
    targeting: ITargeting,
  ): IDamageable[] {
    let validTargets: { unit: IDamageable; dist: number }[] = [];
    const direction = actor.team === "left" ? 1 : -1;
    const actorLane = (actor.lane as number) ?? 0;

    for (let otherUnit of allUnitsInGame) {
      if (targeting.config === "enemy" && actor.team === otherUnit.team)
        continue;
      if (targeting.config === "ally" && actor.team !== otherUnit.team)
        continue;
      if (otherUnit.isDead()) continue;

      const distanceX = (otherUnit.x - actor.x) * direction;

      if (otherUnit.position === "Fortress") {
        if (targeting.config === "ally") continue;
        if (distanceX >= 0 && distanceX <= targeting.rangeX) {
          validTargets.push({ unit: otherUnit, dist: -1 }); // mẹo ưu tiên trụ
        }
        continue;
      }

      const targetLane = (otherUnit.lane as number) ?? 0;
      const laneDiff = Math.abs(actorLane - targetLane);
      if (laneDiff > targeting.laneSpread) continue;

      if (targeting.laneSpread === 0 && distanceX < 0) continue;
      if (Math.abs(distanceX) > targeting.rangeX) continue;

      validTargets.push({ unit: otherUnit, dist: Math.abs(distanceX) });
    }

    validTargets.sort((a, b) => a.dist - b.dist);
    return validTargets.slice(0, targeting.maxTargets).map((t) => t.unit);
  }
}
