import { Router } from "express";
import {
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "./user.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.post("/", createUser);
router.get("/:id", getUserById);

// Protected routes (require authentication)
router.use(authMiddleware);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
