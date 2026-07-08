import api from "@/lib/axios";

export const chatService = {
  sendGeneralChat: async (message: string) => {
    const res = await api.post(
      "/message/general",
      { message },
      { withCredentials: true },
    );

    return res.data;
  },

  getGeneralChat: async () => {
    const res = await api.get("/message/general", { withCredentials: true });

    return res.data;
  },
};
