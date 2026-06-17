import type { Lobby } from "@/types/lobby";
import { create } from "zustand";

export const useLobby = create<Lobby>()((set, get) => ({
  // Mở form thông tin
  isInfoUserFormOpen: false,
  setIsInfoUserFormOpen: () => {
    const newValue = !get().isInfoUserFormOpen;
    set({ isInfoUserFormOpen: newValue });
  },
}));
