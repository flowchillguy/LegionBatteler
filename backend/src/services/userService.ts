import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../errors/ClientErrors.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const patchProfile = async (
  userId: string,
  bio: string,
  displayName: string,
  email: string,
  password: string,
  passwordComfirm: string,
) => {
  // Tìm đúng người yêu cầu và lấy data trong mongoose
  const user = await User.findById(userId);
  if (!user) {
    throw new NotFoundError("Không tìm thấy người dùng!");
  }

  // Xác nhận mật khẩu
  const passwordIsCorrect = await bcrypt.compare(
    passwordComfirm,
    user.hashedPassword,
  );
  if (!passwordIsCorrect) {
    throw new ForbiddenError("Sai mật khẩu!");
  }

  // Kiểm tra bio
  if (bio.length > 500) {
    throw new BadRequestError("Bio không hợp lệ!");
  }

  // Kiểm tra displayName
  if (!displayName || displayName.length < 1 || displayName.length > 100) {
    throw new BadRequestError("D isplay name không hợp lệ!");
  }

  // Kiểm tra email
  const duplicateEmail = await User.findOne({ email });
  if (!email || (duplicateEmail && duplicateEmail.username !== user.username)) {
    throw new BadRequestError("Email không hợp lệ hoặc đã tồn tại!");
  }

  // Kiểm tra password
  if (password.length < 6 && password.length !== 0) {
    throw new BadRequestError("Mật khẩu mới không hợp lệ!");
  }
  if (password.length === 0) {
    password = passwordComfirm;
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  // Update
  const userUpdate = await User.findByIdAndUpdate(
    userId,
    {
      hashedPassword,
      email,
      displayName,
      bio,
    },
    { new: true },
  );

  // Return
  return userUpdate;
};
