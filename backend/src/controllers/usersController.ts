import type { Response } from "express";
import type { CustomRequest } from "../models/CustomRequest.js";
import { controllerHandler } from "../helper/controllerHandler.js";
import { patchProfile } from "../services/userService.js";

export const authMe = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Lỗi khi gọi authMe", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};

export const updatePdrofile = async (req: CustomRequest, res: Response) => {
  try {
    const userId = req.user._id;
    const { bio, displayName, email, password, passwordComfirm } = req.body;
  } catch (error) {}
};

export const updateProfile = controllerHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.user._id;
    const { bio, displayName, email, password, passwordComfirm } = req.body;
    await patchProfile(
      userId,
      bio,
      displayName,
      email,
      password,
      passwordComfirm,
    );
    return { message: "Đổi thông tin thành công!" };
  },
);
