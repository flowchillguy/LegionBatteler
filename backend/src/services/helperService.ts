import transporter from "../config/transporter.js";
import { NotFoundError } from "../errors/ClientErrors.js";
import { generateRandomPassword, maskEmail } from "../helper/helperHandler.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";

export const updateNewPassword = async (username: string) => {
  const user = await User.findOne({ username });

  if (!user) {
    throw new NotFoundError("username không tồn tại!");
  }

  // generate new password
  const newPassword = generateRandomPassword();
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // update database
  await User.findByIdAndUpdate(
    user._id,
    { hashedPassword },
    { returnDocument: "after" },
  );

  // gửi email
  const email = {
    from: `"Legion Batteler" <${process.env.MY_EMAIL}>`,
    to: user.email,
    subject: "Yêu cầu cấp lại mật khẩu tài khoản",
    text: `
    Chào bạn,

    Hệ thống đã nhận được yêu cầu cấp lại mật khẩu cho tài khoản đăng nhập của bạn.
    Mật khẩu mới được tự động tạo là: 
    
    ${newPassword}

    Lưu ý quan trọng: Vui lòng đổi lại mật khẩu ngay sau khi đăng nhập thành công để đảm bảo an toàn.

    Nếu bạn không thực hiện yêu cầu quên mật khẩu này, xin vui lòng bỏ qua email. Tài khoản của bạn vẫn an toàn.
    `,
  };

  await transporter.sendMail(email);

  // che dấu email
  const maskingEmail = maskEmail(user.email);

  // return một phần email
  return maskingEmail;
};
