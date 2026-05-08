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
    // Lấy token từ header
    const authHeader = req.headers.authorization;

    // Debug 1: Xem client gửi lên cái gì
    console.log("1. Auth Header:", authHeader);

    // Kiểm tra xem header có tồn tại và đúng chuẩn 'Bearer ' không
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Không tìm thấy token hoặc sai định dạng Header" });
    }

    const token = authHeader?.split(" ")[1]; // Bearer <Token>

    // Debug 2: Xem token sau khi tách có đúng cấu trúc 3 phần ngăn bằng dấu chấm không
    console.log("2. Token extracted:", token);

    if (!token) {
      return res.status(401).json({ message: "Không tìm thấy access token" });
    }

    // Xác minh token có hợp lệ không?
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
