import type { ActionCombat } from "../components/ActionCombat.js";
import { TargetSeeker } from "../components/TargetSeeker.js";
import {
  type IDamageable,
  type ITargeting,
  type IUnits,
  type TLane,
  type TPosition,
  type TTeam,
  type TX,
} from "../types/EntitiesTypes.js";

const DEFAULT_DEF_FACTOR = 100;

export class Units implements IDamageable {
  readonly name: string;
  readonly cost: number;
  readonly spawnCd: number; // thời gian giữa 2 lần được xuất thành
  readonly position: TPosition;
  moveSpeed: number;

  readonly team: TTeam;
  x: TX;
  lane: TLane;

  targetSeeker: TargetSeeker;
  normalTargeting: ITargeting;
  skillTargeting: ITargeting;
  actionCombat: ActionCombat;

  currentHp: number;

  constructor(data: IUnits) {
    this.name = data.name;
    this.cost = data.cost;
    this.spawnCd = data.spawnCd;
    this.team = data.team;
    this.position = data.position;
    this.moveSpeed = data.moveSpeed; // delta x / giây
    this.x = data.x;
    this.lane = data.lane;
    this.targetSeeker = new TargetSeeker();
    this.normalTargeting = data.normalTargeting;
    this.skillTargeting = data.skillTargeting;
    this.actionCombat = data.actionCombat;
    this.currentHp = this.getMaxHp();
  }

  getMaxHp(): number {
    return Math.max(1, this.actionCombat.statsCombat.hp.calculateStatsTotal());
  }

  getHeal(valueHeal: number): void {
    this.currentHp += valueHeal;
  }

  takeDamage(rawDamage: number): void {
    const defFactor =
      DEFAULT_DEF_FACTOR /
      (DEFAULT_DEF_FACTOR +
        this.actionCombat.statsCombat.def.calculateStatsTotal());
    const finalDamage = Math.max(1, rawDamage * defFactor);
    this.currentHp -= finalDamage;
  }

  isDead(): boolean {
    return this.currentHp <= 0;
  }

  moveForward(deltaTime: number): void {
    const direction = this.team === "left" ? 1 : -1;
    this.x += direction * (this.moveSpeed * deltaTime);
  }

  update(deltaTime: number, allUnitsInGame: IDamageable[]) {
    // 1. Cập nhật thời gian cooldown
    this.actionCombat.updateTimers(deltaTime);

    // 2. Lấy trạng thái cooldown hiện tại
    const isSkillReady = this.actionCombat.isSkillReady();
    const isNormalReady = this.actionCombat.isNormalReady();

    // Tối ưu: Nếu cả đánh thường và skill đều chưa hồi xong -> khỏi cần tìm mục tiêu, đứng im chờ.
    if (!isSkillReady && !isNormalReady) {
      return;
    }

    // 3. Đưa thông tin cho TargetSeeker tìm kiếm
    const targetResult = this.targetSeeker.execute(
      this,
      allUnitsInGame,
      this.normalTargeting,
      this.skillTargeting,
      isSkillReady,
    );

    // 4. Đọc kết quả và ra lệnh thực thi
    switch (targetResult.action) {
      case "skill":
        // TargetSeeker đã check isSkillReady rồi, nên chắc chắn skill dùng được
        this.actionCombat.castSkill(targetResult.targets, this);
        break;

      case "normal":
        // Phải check thêm isNormalReady vì TargetSeeker chỉ check RANGE, không check TIMING của Normal
        if (isNormalReady) {
          this.actionCombat.autoAttack(targetResult.targets, this.position);
        }
        break;

      case "move":
        // Không có mục tiêu nào trong tầm -> Tiến lên phía trước
        this.moveForward(deltaTime);
        break;
    }
  }
}
