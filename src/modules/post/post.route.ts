import { Router } from "express";
import {
  getPosts,
  getPost,
  createPost,
  updatePost,
  removePost,
  togglePublish
} from "./post.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { optionalAuthMiddleware } from "../../middlewares/optionalAuth.middleware.js";

const router = Router();

router.get("/", optionalAuthMiddleware, getPosts);
router.get("/:id", optionalAuthMiddleware, getPost);

// Protected routes
router.post("/", authMiddleware, createPost);
router.put("/:id", authMiddleware, updatePost);
router.patch("/:id/publish", authMiddleware, togglePublish);
router.delete("/:id", authMiddleware, removePost);

export default router;  
