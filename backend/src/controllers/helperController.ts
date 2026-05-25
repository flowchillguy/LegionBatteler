import type { Response } from "express";
import type { CustomRequest } from "../models/CustomRequest.js";
import { controllerHandler } from "../helper/controllerHandler.js";
import { updateNewPassword } from "../services/helperService.js";

export const getNewPassword = controllerHandler(
  async (req: CustomRequest, res: Response) => {
    const { username } = req.body;

    const maskingEmail = await updateNewPassword(username);

    return { message: "Đã gửi email thành công!", maskingEmail };
  },
);
