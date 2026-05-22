import express, { Router } from "express";

import {
  sendFriendRequest,
  acceptFriendRequest,
  declineFriendRequest,
  unfriend,
  getAllFriends,
  getFriendRequests,
} from "../controllers/friendController.js";

const router: Router = express.Router();

router.post("/requests", sendFriendRequest);
router.post("/requests/:requestId/accept", acceptFriendRequest);
router.post("/requests/:requestId/decline", declineFriendRequest);
router.delete("/requests/:friendshipId/unfriend", unfriend);
router.get("/", getAllFriends);
router.get("/requests", getFriendRequests);

export default router;
