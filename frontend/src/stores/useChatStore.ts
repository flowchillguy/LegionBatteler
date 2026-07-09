import { create } from "zustand";
import { toast } from "sonner";
import { chatService } from "@/services/generalChatService";
import type { GeneralChatState } from "@/types/store";
import { socket } from "@/services/socketService";

export const useChatStore = create<GeneralChatState>()((set, get) => ({
  messages: {
    items: [],
    hasMore: true,
    nextCursor: null,
  },
  loading: false,

  getConversation: async (hasMoreParam: boolean, nextCursorParam?: string) => {
    if (!hasMoreParam && nextCursorParam) return;

    set({ loading: true });

    try {
      const data = await chatService.getGeneralChat(50, nextCursorParam);
      const currentMessages = get().messages;

      const updatedItems = nextCursorParam
        ? [...data.messages, ...currentMessages.items]
        : data.messages;

      set({
        messages: {
          items: updatedItems,
          nextCursor: data.nextCursor,
          hasMore: !!data.nextCursor,
        },
      });
    } catch (error) {
      console.error("Lỗi khi lấy hội thoại chat:", error);
      toast.error("Không thể tải tin nhắn cũ, vui lòng thử lại!");
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (message: string) => {
    try {
      await chatService.sendGeneralChat(message);
      socket.emit("send_message", { text: message });
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      toast.error("Không thể gửi tin nhắn!");
    }
  },

  initSocketListener: () => {
    // Tránh việc đăng ký trùng lặp nhiều listener bằng cách tắt cái cũ trước
    socket.off("receive_message");

    // Lắng nghe tin nhắn mới từ server gửi về
    socket.on("receive_message", (newMsg: any) => {
      const currentMessages = get().messages;

      // Kiểm tra xem tin nhắn này đã tồn tại trong danh sách chưa để tránh trùng lặp
      const isExist = currentMessages.items.some(
        (item: any) => item._id === newMsg._id,
      );
      if (isExist) return;

      set({
        messages: {
          ...currentMessages,
          // Nối đuôi tin nhắn mới tinh này vào cuối mảng items
          items: [...currentMessages.items, newMsg],
        },
      });
    });
  },
}));
