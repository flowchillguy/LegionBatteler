import { Router } from "express";
import { getNewPassword } from "../controllers/helperController.js";

const router: Router = Router();

router.post("/password", getNewPassword);

export default router;
