import express from "express";
import {
  addFriend,
  acceptRequest,
  denyRequest,
  deleteFriend,
  addUserToGroup,
} from "../controllers/friend.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/add/:userId", protectRoute, addFriend);

router.post("/accept/:userId", protectRoute, acceptRequest);

router.post("/deny/:userId", protectRoute, denyRequest);

router.delete("/delete/:userId", protectRoute, deleteFriend);

router.post("/group/:groupId/add/:userId", protectRoute, addUserToGroup);

export default router;
