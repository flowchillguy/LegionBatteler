import type { Weapon } from "../entities/Weapon.js";
import type { IBuffData, IStatsCombat } from "../types/EntitiesTypes.js";
import { StatsAdvanced } from "./StatsAdvanced.js";
import { StatsNormal } from "./StatsNormal.js";

export class StatsCombat {
  weapon: Weapon | null;
  atk: StatsNormal;
  hp: StatsNormal;
  def: StatsNormal;
  critRate: StatsAdvanced;
  critDamage: StatsAdvanced;
  siege: StatsAdvanced;
  bonus: StatsAdvanced;
  activeBuffs: Map<string, IBuffData> = new Map();

  constructor(stats: IStatsCombat) {
    this.weapon = stats.weapon ?? null;
    this.atk = stats.atk;
    this.hp = stats.hp;
    this.def = stats.def;
    this.critRate = stats.critRate;
    this.critDamage = stats.critDamage;
    this.siege = stats.siege;
    this.bonus = stats.bonus;
  }

  // nạp 1 buff vào chỉ số
  private applySingleBuff(buffData: IBuffData): void {
    if (buffData.baseAtk !== undefined) this.atk.addBase(buffData.baseAtk);
    if (buffData.multAtk !== undefined) this.atk.applyMult(buffData.multAtk);
    if (buffData.flatAtk !== undefined) this.atk.applyFlat(buffData.flatAtk);
    if (buffData.multHp !== undefined) this.hp.applyMult(buffData.multHp);
    if (buffData.flatHp !== undefined) this.hp.applyFlat(buffData.flatHp);
    if (buffData.multDef !== undefined) this.def.applyMult(buffData.multDef);
    if (buffData.flatDef !== undefined) this.def.applyFlat(buffData.flatDef);
    if (buffData.addCritRate !== undefined)
      this.critRate.applyStats(buffData.addCritRate);
    if (buffData.addCritDamage !== undefined)
      this.critDamage.applyStats(buffData.addCritDamage);
    if (buffData.addSiege !== undefined)
      this.siege.applyStats(buffData.addSiege);
    if (buffData.bonus !== undefined) this.bonus.applyStats(buffData.bonus);
  }

  // tính lại chỉ số mới nhất
  private recalculateAllStats(): void {
    // reset về chỉ số gốc
    this.atk.resetStats();
    this.hp.resetStats();
    this.def.resetStats();
    this.critRate.resetStats();
    this.critDamage.resetStats();
    this.siege.resetStats();
    this.bonus.resetStats();

    // nạp mới danh sách buff
    for (const buffData of this.activeBuffs.values()) {
      this.applySingleBuff(buffData);
    }
  }

  // nhận buff từ các nguồn
  addBuff(buffId: string, buffData: IBuffData): void {
    this.activeBuffs.set(buffId, buffData);
    this.recalculateAllStats();
  }

  // xóa buff
  removeBuff(buffId: string): void {
    if (this.activeBuffs.has(buffId)) {
      this.activeBuffs.delete(buffId);
      this.recalculateAllStats();
    }
  }

  private isCrit(): boolean {
    return Math.random() <= this.critRate.currentStats;
  }

  caculateRawDamge(scale: number): number {
    const totalAtkCurrent = this.atk.calculateCurrentStatsTotal();
    const rawDamage = totalAtkCurrent * scale * (1 + this.bonus.currentStats);
    if (this.isCrit()) {
      return rawDamage * (1 + this.critDamage.currentStats);
    }
    return rawDamage;
  }
}
