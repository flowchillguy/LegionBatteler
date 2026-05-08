import type { Request } from "express";

export interface CustomRequest extends Request {
  user?: any; // bổ xung cấu trúc user vào req
}
