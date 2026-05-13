import type { Response, NextFunction } from "express";
import type { CustomRequest } from "../models/CustomRequest.js";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

interface DecodedToken extends JwtPayload {
  userId: string;
}

// Authorization - xác minh người dùng
export const protectedRoute = (
  req: CustomRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    // Lấy access token từ header
    const authHeader = req.headers.authorization;

    const token = authHeader?.split(" ")[1]; // Bearer <Token>

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // Xác minh access token có hợp lệ không?
    jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
      async (err, decodedUser) => {
        if (err) {
          console.error(err);

          return res
            .status(403)
            .json({ message: "Access token hết hạn hoặc không đúng" });
        }

        decodedUser = decodedUser as DecodedToken;
        // Token đã hợp lệ => lấy thông tin user
        const user = await User.findById(decodedUser.userId).select(
          "-hashedPassword",
        );

        if (!user) {
          return res.status(404).json({ message: "Người dùng không tồn tại!" });
        }

        // Thêm user vào req để tái sử dụng
        req.user = user;
        next();
      },
    );
  } catch (error) {
    console.error("Lỗi khi xác minh JWT trong authMiddleware", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
