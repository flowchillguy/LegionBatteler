import express from "express";
import {
  getGeneralChat,
  sendGeneralChat,
  sendRoomChat,
} from "../controllers/messageController.js";

const router = express.Router();

router.post("/general", sendGeneralChat);
router.get("/general", getGeneralChat);
router.post("/room", sendRoomChat);

export default router;
