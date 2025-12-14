import express from "express";
import { likePost, unlikePost, getLikes } from "../controllers/likecontroller.js";
import protectRoute from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/", protectRoute, likePost);

router.delete("/", protectRoute, unlikePost);

router.get("/:postId", getLikes);

export default router;
