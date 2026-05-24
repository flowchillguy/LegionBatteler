import express, { Router } from "express";
import { authMe, updateProfile } from "../controllers/usersController.js";

const route: Router = express.Router();

// Quan trọng: gửi data user về client
route.get("/me", authMe);
route.patch("/me", updateProfile);

export default route;
