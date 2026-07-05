import api from "@/lib/axios";

export const friendService = {
  sendFriendRequest: async (to: string, message: string) => {
    const res = await api.post(
      "/friends/requests",
      { to, message },
      { withCredentials: true },
    );

    return res.data;
  },
};
