import User from "../models/User.js";
import Session from "../models/Sesion.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_TTL = "15m"; // thuờng là dưới 15m
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

interface SignUpData {
  username?: string;
  password?: string;
  confirmPassword?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

const usernameRegex = /^[a-zA-Z0-9_]+$/;

export const createAccount = async (data: SignUpData) => {
  const { username, password, confirmPassword, email, firstName, lastName } =
    data;

  // Kiểm tra dữ liệu đầu vào
  if (
    !username ||
    !password ||
    !confirmPassword ||
    !email ||
    !firstName ||
    !lastName
  ) {
    throw new Error("LỖI NHẬP THIẾU DỮ LIỆU!");
  }

  // Kiểm tra username có đúng định dạng chưa.
  if (!usernameRegex.test(username)) {
    throw new Error("TÊN ĐĂNG NHẬP KHÔNG HỢP LỆ");
  }

  // Kiểm tra trùng username
  const duplicate = await User.findOne({ username });
  if (duplicate) throw new Error("LỖI USER ĐÃ TỒN TẠI!");

  // Khớp password với cofirmPassword
  if (password !== confirmPassword) {
    throw new Error("LỖI MẬT KHẨU XÁC NHẬN KHÔNG ĐÚNG!");
  }

  // Mã hóa mật khẩu
  const hashedPassword = await bcrypt.hash(password, 10);

  // Lưu vào database
  const newUser = await User.create({
    username,
    hashedPassword,
    email,
    displayName: `${firstName} ${lastName}`,
  });

  return newUser;
};

export const authenticateUser = async (data: {
  username: string;
  password: string;
}) => {
  const { username, password } = data;

  if (!username || !password) {
    throw new Error("LỖI NHẬP THIẾU DỮ LIỆU!");
  }

  // Kiểm tra user có tồn tại không
  const user = await User.findOne({ username });
  if (!user) throw new Error("LỖI SAI USERNAME HOẶC PASSWORD!");

  // So sánh hashedPassword trong db với password input
  const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);
  if (!passwordCorrect) throw new Error("LỖI SAI USERNAME HOẶC PASSWORD!");

  // Đến đây username và password đã chính xác
  // ============================================================
  // Tạo accessToken với JWT
  const accessToken = jwt.sign(
    // Thông tin muốn đính kèm vào Token
    { userId: user._id },
    // Một chuỗi bí mật chỉ Server biết. Nó dùng để tạo ra chữ ký (Signature)
    // @ts-ignore
    process.env.ACCESS_TOKEN_SECRET,
    // Options: Cấu hình thêm, expiresIn (thời gian hết hạn)
    { expiresIn: ACCESS_TOKEN_TTL },
  );

  // Tạo refresh token và lưu và CSDL
  const refreshToken = crypto.randomBytes(64).toString("hex");
  await Session.create({
    userId: user._id,
    refreshToken,
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
  });

  return [accessToken, refreshToken, REFRESH_TOKEN_TTL];
};

export const revokeSession = async (refreshToken: string) => {
  // Xóa refresh token trong CSDL
  await Session.deleteOne({ refreshToken: refreshToken });
};

export const renewAccessToken = async () => {};
