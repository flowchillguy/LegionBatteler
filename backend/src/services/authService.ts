import bcrypt from "bcrypt";
import User from "../models/User.js";

interface SignUpData {
  username?: string;
  password?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
}

export const createAccount = async (data: SignUpData) => {
  const { username, password, email, firstName, lastName } = data;

  // Kiểm tra dữ liệu đầu vào
  if (!username || !password || !email || !firstName || !lastName) {
    throw new Error("LỖI NHẬP THIẾU DỮ LIỆU!");
  }

  // Kiểm tra trùng username
  const duplicate = await User.findOne({ username });
  if (duplicate) throw new Error("LỖI USER ĐÃ TỒN TẠI!");

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
