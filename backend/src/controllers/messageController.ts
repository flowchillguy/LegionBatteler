import type { Response } from "express";
import type { CustomRequest } from "../models/CustomRequest.js";
import {
  createNewMessageGeneral,
  createNewMessageRoom,
  fetchGeneralChat,
} from "../services/messageService.js";

// Chat tổng
export const sendGeneralChat = async (req: CustomRequest, res: Response) => {
  try {
    const { content, guestName } = req.body;
    const senderId = req.user._id;

    const message = await createNewMessageGeneral(content, senderId);
    return res.status(200).json({ message });
  } catch (error: any) {
    if (error.message === "Lỗi! Gửi tin nhắn rỗng!") {
      return res.status(400).json({ message: error.message });
    }
  }
};

// Phân trang BE: limit & cursor
export const getGeneralChat = async (req: CustomRequest, res: Response) => {
  try {
    const { limitString, cursor } = req.query;
    const limit = Number(limitString);
    const { messages, nextCursor } = await fetchGeneralChat(limit, cursor);
    return res.status(200).json({
      messages,
      nextCursor,
    });
  } catch (error: any) {
    console.error("Lỗi! Xảy ra khi lấy data generalChat!", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const sendRoomChat = async (req: CustomRequest, res: Response) => {
  try {
    const { content } = req.body;
    const senderId = req.user._id;

    const message = await createNewMessageRoom(content, senderId);

    return res.status(201).json({ message });
  } catch (error: any) {
    if ((error.message = "Lỗi thiếu nội dung")) {
      res.status(400).json({ message: error.message });
    }
  }
};
