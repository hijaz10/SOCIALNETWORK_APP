import express from "express";
import { arcjetProtection } from "../middleware/arcjetmiddleware.js";
import {
  signup,
  login,
  logout,
  getUser,
  updateUser,
  deleteUser,
  sendVerificationCode
} from "../controllers/authcontroller.js";
import protectRoute from "../middleware/protectRoutes.js";

const router = express.Router();
router.use(arcjetProtection);

router.post("/verifyemail", sendVerificationCode);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/:id", protectRoute, getUser);
router.put("/:id", protectRoute, updateUser);
router.delete("/:id", protectRoute, deleteUser);

export default router;
