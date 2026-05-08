import type { Request, Response } from "express";
import {
  createAccount,
  authenticateUser,
  revokeSession,
  renewAccessToken,
} from "../services/authService.js";

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
    console.error("Lỗi khi gọi createAccount!", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};

export const signIn = async (req: Request, res: Response) => {
  try {
    const [accessToken, refreshToken, REFRESH_TOKEN_TTL] =
      await authenticateUser(req.body);

    // Gửi refresh token cho client và tự động gắn vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: Number(REFRESH_TOKEN_TTL),
    });

    // Gửi access token cho client, backend tự gắn vào header
    return res
      .status(200)
      .json({ message: "User đã đăng nhập thành công!", accessToken });
  } catch (error: any) {
    if (error.message === "LỖI NHẬP THIẾU DỮ LIỆU!")
      return res.status(400).json({ message: "Thiếu username hoặc password" });
    if (error.message === "LỖI SAI USERNAME HOẶC PASSWORD!")
      return res
        .status(400)
        .json({ message: "Username hoặc password không chính xác" });
    console.error("Lỗi khi gọi authenticateUser", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};

export const signOut = async (req: Request, res: Response) => {};

export const refresh = async (req: Request, res: Response) => {};
