import type { Request, Response } from "express";
import { createAccount } from "../services/authService.js";

import jwt from "jsonwebtoken";
import crypto from "crypto";

export const signUp = async (req: Request, res: Response) => {
  try {
    await createAccount(req.body);
    return res.status(201).json({ message: "Tạo tài khoản thành công!" });
  } catch (error: any) {
    if (error.message === "LỖI NHẬP THIẾU DỮ LIỆU!") {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }
    if (error.message === "LỖI USER ĐÃ TỒN TẠI!") {
      return res.status(400).json({ message: "Username đã tồn tại!" });
    }
    console.error("Lỗi khi gọi signUp!", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};

export const signIn = async (req: Request, res: Response) => {};

export const signOut = async (req: Request, res: Response) => {};

export const refresh = async (req: Request, res: Response) => {};
