export type TTypeLvUp = "gold" | "fortress" | "units" | "weapon";

export interface ILevelUp {
  level: number;
  lvUp: () => void;
}
