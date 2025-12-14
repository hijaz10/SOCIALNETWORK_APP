import express from "express";
import { addComment, getComments, deleteComment } from "../controllers/commentcontroller.js";
import protectRoute from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/", protectRoute, addComment);

router.get("/:postId", getComments);

router.delete("/:id", protectRoute, deleteComment);

export default router;
