import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env.js";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // example: { id: 1, role: "USER" }
    next();
  } catch (err) {
    console.log(err);
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function authorizeRoles(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || typeof req.user !== 'object' || !('role' in req.user) || !roles.includes((req.user as { role: string }).role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
