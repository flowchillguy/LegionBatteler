import express from "express";
import { protectedRoute } from "../middlewares/authMiddleware.js";
import authRoute from "./authRoute.js";
import userRoute from "./usersRoute.js";
import friendRoute from "./friendRoute.js";
import messageRoute from "./messageRoute.js";
import helperRoute from "./helperRoute.js"
import { type Router } from "express";

const router: Router = express.Router();

// PUBLIC ROUTES
router.use("/auth", authRoute);
router.use("/helper", helperRoute);

// PRIVATE ROUTES
router.use(protectedRoute);
router.use("/users", userRoute);
router.use("/friends", friendRoute);
router.use("/message", messageRoute);

export default router;
