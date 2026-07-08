import { create } from "zustand";
import { toast } from "sonner";
import { chatService } from "@/services/generalChatService";
import type { GeneralChatState } from "@/types/store";

export const useChatStore = create<GeneralChatState>()((set, get) => ({
  messages: {
    items: [],
    hasMore: false,
    nextCursor: null,
  },
  loading: false,
  getConversation: async () => {},
  sendMessage: async (message: string) => {},
  reset: async () => {},
}));
