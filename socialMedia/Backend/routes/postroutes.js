import express from "express";
import {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} from "../controllers/postcontroller.js";
import protectRoute from "../middleware/protectRoutes.js";

const router = express.Router();

router.post("/", protectRoute, createPost);
router.get("/", getAllPosts);
router.get("/:id", getPost);
router.put("/:id", protectRoute, updatePost);
router.delete("/:id", protectRoute, deletePost);

export default router;
