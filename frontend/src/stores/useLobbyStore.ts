import type { Lobby } from "@/types/lobby";
import { create } from "zustand";

export const useLobbyStore = create<Lobby>()((set, get) => ({
  isInfoUserFormOpen: false,
  onlineUsers: 1,
  inGameUser: 0,
  isMatchking: false,
  room: { currentRoom: null, players: [] },

  setIsInfoUserFormOpen: () => {
    const newValue = !get().isInfoUserFormOpen;
    set({ isInfoUserFormOpen: newValue });
  },

  setOnlineUser: (onlineUsers: number) => {
    set({ onlineUsers });
  },

  setInGameUser: (inGameUser: number) => {
    set({ inGameUser });
  },

  setIsMatchking: (isMatchking: boolean) => {
    set({ isMatchking });
  },

  setRoom: (currentRoom = null, players = []) => {
    set({
      room: { currentRoom, players },
    });
  },
}));
