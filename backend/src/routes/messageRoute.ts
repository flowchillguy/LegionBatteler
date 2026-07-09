import express, { Router } from "express";
import {
  getGeneralChat,
  sendGeneralChat,
} from "../controllers/messageController.js";

const router: Router = express.Router();

router.post("/general", sendGeneralChat);
router.get("/general", getGeneralChat);

export default router;
