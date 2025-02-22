import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { app, server } from "./socket/socket.js";
dotenv.config();
const port = process.env.PORT || 5001;
app.use(cookieParser()); // for parsing cookies
app.use(express.json()); // for parsing application/json
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
