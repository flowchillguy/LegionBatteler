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
