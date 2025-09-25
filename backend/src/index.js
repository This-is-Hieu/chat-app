import express from "express";
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.route.js";
import cors from "cors"
import { connectDB } from "./lib/db.js";
import messageRoutes from "./routes/message.route.js"
import {io,app,server} from "./lib/socket.js"
import friendRoutes from "./routes/friend.route.js"

dotenv.config()


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use("/api/auth",authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/friends",friendRoutes);
const PORT = process.env.PORT;
server.listen(5001,() => {
    console.log("server is running on port: "+PORT);
    connectDB()
});