import type { Game } from "@/types/game";
import { create } from "zustand";

export const useGameStore = create<Game>()((set, get) => ({
  gameRoomId: null,
  players: null,
  status: "ended",
}));
