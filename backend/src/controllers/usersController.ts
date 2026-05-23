import type { Response } from "express";
import type { CustomRequest } from "../models/CustomRequest.js";

export const authMe = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};