import express, { Router } from "express";
import { authMe } from "../controllers/usersController.js";

const route: Router = express.Router();

// Quan trọng: gửi data user về client
route.get("/me", authMe);

export default route;
