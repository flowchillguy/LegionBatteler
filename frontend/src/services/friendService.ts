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

  getAllFriends: async () => {
    const res = await api.get("/friends/", { withCredentials: true });

    return res.data.friends;
  },

  getFriendRequests: async () => {
    const res = await api.get("/friends/requests", { withCredentials: true });

    return res.data;
  },

  acceptFriendRequest: async (idFriend: string) => {
    const res = await api.post(
      `friends/requests/${idFriend}/accept`,
      {},
      { withCredentials: true },
    );

    return res.data;
  },

  declineFriendRequest: async (idFriend: string) => {
    const res = await api.post(
      `friends/requests/${idFriend}/decline`,
      {},
      { withCredentials: true },
    );

    return res.data;
  },

  unfriend: async (friendshipId: string) => {
    const res = await api.delete(`friends/requests/${friendshipId}/unfriend`, {
      withCredentials: true,
    });

    return res.data;
  },
};
