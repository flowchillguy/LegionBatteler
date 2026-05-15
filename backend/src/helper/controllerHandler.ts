import type { CustomRequest } from "../models/CustomRequest.js";
import type { NextFunction, Response } from "express";
import { AppError } from "../errors/AppError.js";

export const controllerHandler = (
  controllerFunction: (req: CustomRequest, res: Response) => Promise<Response>,
  statusCode = 200,
) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const result = await controllerFunction(req, res);
      if (result) {
        return res.status(statusCode).json(result);
      }
    } catch (error: any) {
      if (error instanceof AppError) {
        return res.status(error.statusCode).json({ message: error.message });
      }
      console.error("==>> Lỗi hệ thống:", error);
      return res.status(500).json({ message: "==>> Lỗi hệ thống" });
    }
  };
};
