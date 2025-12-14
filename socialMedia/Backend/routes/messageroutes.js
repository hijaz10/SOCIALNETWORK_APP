import express from "express";
import {
  getAllContacts,
  getChatPartners,
  getMessagesByUserId,
  sendMessage,
} from "../controllers/messagecontroller.js";
import { arcjetProtection } from "../middleware/arcjetmiddleware.js";
import protectRoute from "../middleware/protectRoutes.js";

const router = express.Router();

// Requests get rate-limited first, then authenticated.
router.use(arcjetProtection, protectRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUserId);
router.post("/send/:id", sendMessage);

export default router;