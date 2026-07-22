import type { IDamageable } from "../types/EntitiesTypes.js";
import type { ILevelUp } from "../types/LevelUpTypes.js";

const MAX_GOLD = 999;
const MAX_LEVEL = 5;
const GOLD_INCOME = 5; // vàng nhận được mỗi chu kỳ
const GOLD_BONUS = 0.2;
const GOLD_UNIT_DROP = 1;
const GOLD_FORTRESS_DROP = 4;
const CYCLE = 5; // 5 giây nhận 1 lần (chu kỳ)

export class GoldManager implements ILevelUp {
  gold: number = 0;
  level: number = 0;
  goldTimer: number = 0;

  // khả năng tri chả
  canAfford(amount: number): boolean {
    return this.gold >= amount;
  }

  // trừ tiền
  deductGold(amount: number): boolean {
    if (!this.canAfford(amount)) return false;
    this.gold -= amount;
    return true;
  }

  // lên cấp
  lvUp() {
    if (this.level < MAX_LEVEL) {
      this.level++;
    }
  }

  // hàm cộng gold
  receiveGold(amount: number) {
    this.gold += amount;
    if (this.gold > MAX_GOLD) this.gold = MAX_GOLD;
  }

  // hàm cộng tiền định kì (nhận lương)
  receiveSalary(deltaTime: number) {
    this.goldTimer += deltaTime;
    if (this.goldTimer >= CYCLE) {
      this.goldTimer -= CYCLE;
      const salary = GOLD_INCOME * (1 + this.level * GOLD_BONUS);
      this.receiveGold(salary);
    }
  }

  // hàm nhặt tiền từ hạ lính hoặc thành
  receiveTips(object: IDamageable) {
    if (object.isDead()) {
      if (object.position === "Fortress") {
        this.receiveGold(GOLD_FORTRESS_DROP);
      } else {
        this.receiveGold(GOLD_UNIT_DROP);
      }
    }
  }
}
