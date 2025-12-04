import { Request, Response, NextFunction } from "express";
import {
  createUserService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "./user.service.js";

export async function getUserById(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await getUserByIdService(Number(req.params.id));
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, name, password } = req.body;
    const newUser = await createUserService({ email, name, password });
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const updatedUser = await updateUserService(Number(req.params.id), req.body);
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, data: updatedUser });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const deletedUser = await deleteUserService(Number(req.params.id));
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}
