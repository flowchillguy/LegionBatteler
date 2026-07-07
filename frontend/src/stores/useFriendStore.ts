import { create } from "zustand";
import { toast } from "sonner";
import { friendService } from "@/services/friendService";
import type { FriendState } from "@/types/store";
import { persist } from "zustand/middleware";

export const useFriendStore = create<FriendState>()(
  persist(
    (set, get) => ({
      friends: [],
      sentFriendRequest: [],
      receivedFriendRequest: [],

      getAllFriends: async () => {
        try {
          const friends = await friendService.getAllFriends();
          set({ friends });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Lấy danh sách kết bạn thất bại, vui lòng thử lại!";
          toast.error(errorMessage);
        }
      },

      sendFriendRequest: async (username: string, message: string) => {
        if (!username.trim()) {
          toast.error("Vui lòng nhập username!");
          return;
        }

        try {
          await friendService.sendFriendRequest(username, message);
          get().getFriendRequests();
          toast.success("Gửi lời mời thành công!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Gửi lời mời thất bại, vui lòng thử lại!";
          toast.error(errorMessage);
        }
      },

      getFriendRequests: async () => {
        try {
          const data = await friendService.getFriendRequests();
          set({
            sentFriendRequest: data.sent,
            receivedFriendRequest: data.received,
          });
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || "Lấy danh sách kết bạn thất bại!";
          toast.error(errorMessage);
        }
      },

      acceptFriendRequest: async (idFriend: string) => {
        try {
          await friendService.acceptFriendRequest(idFriend);
          get().getAllFriends();
          get().getFriendRequests();
          toast.success("Đồng ý kết bạn thành công!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Đồng ý kết bạn thất bại, vui lòng thử lại!";
          toast.error(errorMessage);
        }
      },

      declineFriendRequest: async (idFriend: string) => {
        try {
          await friendService.declineFriendRequest(idFriend);
          get().getAllFriends();
          get().getFriendRequests();
          toast.success("Từ chối kết bạn thành công!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Từ chối kết bạn thất bại, vui lòng thử lại!";
          toast.error(errorMessage);
        }
      },

      unfriend: async (friendshipId: string) => {
        try {
          await friendService.unfriend(friendshipId);
          get().getAllFriends();
          toast.success("Hủy kết bạn thành công!");
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message ||
            "Hủy kết bạn thất bại, vui lòng thử lại!";
          toast.error(errorMessage);
          console.log(error);
        }
      },
    }),

    {
      name: "friend-storage",
    },
  ),
);
