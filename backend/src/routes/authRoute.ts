import express, { Router } from "express";
import {
  signUp,
  signIn,
  signOut,
  refresh,
} from "../controllers/authController.js";

const route: Router = express.Router();

route.post("/signup", signUp);

route.post("/signin", signIn);

route.post("/signout", signOut);

route.post("/refresh", refresh);

export default route;
