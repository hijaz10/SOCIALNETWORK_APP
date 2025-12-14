import express from "express";
import cors from "cors";
import "dotenv/config";
import path from "path";
import cookieParser from "cookie-parser";

import connectdb from "./configs/db.js";
import { app, server } from "./configs/sockets.js";


import authRoutes from "./routes/authroutes.js";
import postRoutes from "./routes/postroutes.js";
import commentRoutes from "./routes/commentroutes.js";
import likeRoutes from "./routes/likeroutes.js";
import messageRoutes from "./routes/messageroutes.js";


import protectRoute from "./middleware/protectRoutes.js";

const __dirname = path.resolve();

await connectdb();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.get("/", (req, res) => res.send("server running"));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", protectRoute, postRoutes);
app.use("/api/v1/comments", protectRoute, commentRoutes);
app.use("/api/v1/likes", protectRoute, likeRoutes);
app.use("/api/v1/messages", protectRoute, messageRoutes);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
