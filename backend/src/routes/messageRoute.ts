import express, { Router } from "express";
import {
  getGeneralChat,
  sendGeneralChat,
  sendRoomChat,
} from "../controllers/messageController.js";

const router: Router = express.Router();

router.post("/general", sendGeneralChat);
router.get("/general", getGeneralChat);
router.post("/room", sendRoomChat);

export default router;
