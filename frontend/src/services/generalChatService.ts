import api from "@/lib/axios";

export const chatService = {
  getGeneralChat: async (limit: number, nextCursor?: string) => {
    const res = await api.get("/message/general", {
      // Truyền params vào đây, Axios sẽ tự động nối thành dạng ?limit=...&cursor=...
      params: {
        limit: limit,
        cursor: nextCursor, // Nếu nextCursor là undefined, Axios sẽ tự động bỏ qua không gửi key này
      },
      withCredentials: true,
    });

    return res.data; 
    // Đầu ra trả về thường sẽ có cấu trúc: { messages: [...], nextCursor: "..." } giống như BE trả về
  },

  sendGeneralChat: async (content: string) => {
    const res = await api.post(
      "/message/general",
      { content },
      { withCredentials: true },
    );

    return res.data;
  },
};
