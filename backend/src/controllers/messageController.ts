import type { Response } from "express";
import type { CustomRequest } from "../models/CustomRequest.js";
import { createNewMessageGeneral } from "../services/messageService.js";

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

export const sendRoomChat = (req: CustomRequest, res: Response) => {};
