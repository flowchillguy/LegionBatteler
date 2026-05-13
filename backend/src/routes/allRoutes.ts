import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import authRoute from "./authRoute.js";
import userRoute from "./usersRoute.js";
import friendRoute from "./friendRoute.js";
import messageRoute from "./messageRoute.js";

const router = express.Router();

// PUBLIC ROUTES
router.use("/auth", authRoute);
router.use("/message", messageRoute);

// PRIVATE ROUTES
router.use(protectedRoute);
router.use("/users", userRoute);
router.use("/friends", friendRoute);

export default router;
