import type { IDamageable, ITargeting } from "../types/EntitiesTypes.js";

export class TargetSeeker {
  execute(
    actor: IDamageable, // unit đang đánh
    allUnitsInGame: IDamageable[],
    targeting: ITargeting,
  ): IDamageable[] {
    let validTargets: { unit: IDamageable; dist: number }[] = [];
    let fortressTarget: IDamageable | null = null; // Biến lưu trữ Thành địch
    const direction = actor.team === "left" ? 1 : -1;
    const actorLane = (actor.lane as number) ?? 0;

    for (let otherUnit of allUnitsInGame) {
      // Lọc theo phe
      if (targeting.config === "enemy" && actor.team === otherUnit.team)
        continue;
      if (targeting.config === "ally" && actor.team !== otherUnit.team)
        continue;
      if (otherUnit.isDead()) continue;

      // lọc theo khoảng cách (trục X)
      const distanceX = (otherUnit.x - actor.x) * direction;

      // Lọc theo fortress
      if (otherUnit.position === "Fortress") {
        // Chọn đồng minh thì không thể chọn thành
        if (targeting.config === "ally") {
          continue;
        }

        if (distanceX >= 0 && distanceX <= targeting.rangeX) {
          fortressTarget = otherUnit;
        }
        continue;
      }

      // Lọc theo lane (trục y)
      const targetLane = (otherUnit.lane as number) ?? 0;
      const laneDiff = Math.abs(actorLane - targetLane);
      if (laneDiff > targeting.laneSpread) continue;

      // Nếu là đòn đánh thẳng (không phải AoE 3x3 quanh bản thân), thì mục tiêu phải nằm PHÍA TRƯỚC mặt
      if (targeting.laneSpread === 0 && distanceX < 0) continue;

      // Nếu khoảng cách tuyệt đối lớn hơn tầm đánh -> loại
      if (Math.abs(distanceX) > targeting.rangeX) continue;

      // Lọt qua các màng lọc -> Là mục tiêu hợp lệ
      validTargets.push({ unit: otherUnit, dist: Math.abs(distanceX) });
    }

    // KIỂM TRA MỤC TIÊU
    // Nếu Thành lọt vào tầm đánh, bỏ qua mọi mục tiêu khác!
    if (fortressTarget) {
      return [fortressTarget];
    }

    // Sắp xếp mục tiêu gần nhất lên đầu
    validTargets.sort((a, b) => a.dist - b.dist);

    // Trả về mục tiêu tối đa được/bị nhắm đến
    return validTargets.slice(0, targeting.maxTargets).map((t) => t.unit);
  }
}
