import express from "express";
import morgan from "morgan";
import { errorHandler } from "../middlewares/errorHandler.js";
import userRoutes from "../modules/user/user.route.js";
import postRoutes from "../modules/post/post.route.js";
import authRoutes from "../modules/auth/auth.route.js";
import cors from "cors";

export const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({
    origin: "*"
}));

// Register feature routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Global Error handler
app.use(errorHandler);
