import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import {
  sendGeneralChat,
  sendRoomChat,
} from "../controllers/messageController.js";

const router = express.Router();

// chat tổng
router.post("/general", sendGeneralChat);

// thêm protected
router.use(protectedRoute)
router.post("/room", sendRoomChat);

export default router;
