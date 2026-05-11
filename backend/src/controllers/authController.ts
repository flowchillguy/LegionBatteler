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
    if (error.message === "TÊN ĐĂNG NHẬP KHÔNG HỢP LỆ") {
      return res.status(400).json({ message: "Tên đăng nhập không hợp lệ!" });
    }
    if (error.message === "LỖI NHẬP THIẾU DỮ LIỆU!") {
      return res
        .status(400)
        .json({ message: "Vui lòng nhập đầy đủ thông tin!" });
    }
    if (error.message === "LỖI USER ĐÃ TỒN TẠI!") {
      return res.status(400).json({ message: "Username đã tồn tại!" });
    }
    if (error.message === "LỖI MẬT KHẨU XÁC NHẬN KHÔNG ĐÚNG!") {
      return res.status(400).json({ message: "Mật khẩu xác nhận không khớp" });
    }
    console.error("Lỗi khi gọi signUp!", error);
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
    console.error("Lỗi khi gọi signIn", error);
    return res.status(500).json({ message: "Lỗi máy chủ nội bộ." });
  }
};

export const signOut = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await revokeSession(refreshToken);

      // Xóa cookie
      res.clearCookie("refreshToken");
    }

    return res.status(204).json({ message: "Đăng xuất thành công" });
  } catch (error) {
    console.error("Lỗi khi gọi signOut", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const refresh = async (req: Request, res: Response) => {
  try {
    // Lấy refresh token trong cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại!" });
    }

    const newAccessToken = await renewAccessToken(token);

    return res.status(200).json({ accessToken: newAccessToken });
  } catch (error: any) {
    if (error.message === "KHÔNG TÌM THẤY REFRESH TOKEN TRONG DB") {
      return res
        .status(403)
        .json({ message: "refresh token không hợp lệ hoặc đã hết hạn!" });
    }
    if (error.message === "REFRESH ĐÃ TOKEN HẾT HẠN") {
      return res.status(403).json({ message: "refresh token đã hết hạn!" });
    }
    console.error("Lỗi khi gọi refesh", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
