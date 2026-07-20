import type { TTeam } from "../types/EntitiesTypes.js";
import { DeckManager } from "./DeckManager.js";
import { Fortress } from "./Fortress.js";
import { GoldManager } from "./GoldManager.js";

export class Player {
  goldManager: GoldManager;
  fortress: Fortress;
  deckManager: DeckManager;

  constructor(team: TTeam) {
    this.goldManager = new GoldManager();
    this.fortress = new Fortress(team);
    this.deckManager = new DeckManager();
  }
}
