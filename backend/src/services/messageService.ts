import GeneralChat from "../models/GeneralChat.js";

export const createNewMessageGeneral = async (
  content: string,
  senderId: string,
) => {
  if (!content) {
    throw new Error("Lỗi! Gửi tin nhắn rỗng!");
  }

  const message = await GeneralChat.create({
    senderId,
    content,
  });
  return message;
};

export const fetchGeneralChat = async (limit = 50, cursor: any) => {
  const query: Record<string, any> = {};
  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  let messages = await GeneralChat.find(query)
    .sort({ createdAt: -1 }) //Lấy tin mới nhất
    .limit(limit + 1);

  let nextCursor = null;
  const messageLength = messages.length;
  if (messageLength > limit) {
    const nextMessage: any = messages[messageLength - 1];
    nextCursor = nextMessage.createdAt.toISOString();
    messages.pop();
  }

  // Tin mới nhất sẽ ở cuối
  messages = messages.reverse();

  return { messages, nextCursor };
};

export const createNewMessageRoom = (content: string, senderId: string) => {
  if (!content) {
    throw new Error("Lỗi thiếu nội dung");
  }

  // Logic tạo tin nhắn mới trong ram/server
};
