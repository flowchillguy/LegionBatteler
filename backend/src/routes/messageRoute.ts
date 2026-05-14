import express from "express";
import {
  sendGeneralChat,
  sendRoomChat,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/general", sendGeneralChat);
router.post("/room", sendRoomChat);

export default router;
