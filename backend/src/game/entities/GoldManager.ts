import type { IDamageable } from "../types/EntitiesTypes.js";

const MAX_GOLD = 999;
const MAX_LEVEL = 5;
const GOLD_INCOME = 5; // vàng nhận được mỗi chu kỳ
const GOLD_BONUS = 0.2;
const GOLD_UNIT_DROP = 1;
const GOLD_FORTRESS_DROP = 4;
const CYCLE = 5; //chu kỳ nhận vàng

export class GoldManager {
  gold: number = 0;
  level: number = 0;
  cycle: number = CYCLE;
  goldIncome: number = GOLD_INCOME;
  goldBonus: number = GOLD_BONUS;
  goldTimer: number = 0;

  change(money: number): boolean {
    if (this.gold + money >= 0) {
      this.gold += money;
      if (this.gold > MAX_GOLD) this.gold = MAX_GOLD;
      return true;
    }
    return false;
  }

  levelUp() {
    if (this.level < MAX_LEVEL) {
      this.goldIncome = Math.round(this.goldIncome * (1 + this.goldBonus));
      this.level++;
    }
  }

  receiveSalary(deltaTime: number): void {
    this.goldTimer += deltaTime;
    if (this.goldTimer >= this.cycle) {
      this.change(this.goldIncome);
      this.goldTimer -= this.cycle;
    }
  }

  pickUp(object: IDamageable): void {
    if (object.position === "Fortress") {
      this.change(GOLD_FORTRESS_DROP);
      return;
    }
    if (object.isDead()) {
      this.change(GOLD_UNIT_DROP);
      return;
    }
  }
}
