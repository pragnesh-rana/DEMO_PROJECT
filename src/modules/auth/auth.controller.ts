import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../../lib/prisma.js';
import bcrypt from 'bcrypt';
import { JWT_SECRET } from '../../config/env.js';

interface UserWithPassword {
  id: number;
  email: string;
  name: string | null;
  password: string;
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;

    // Find user by email with password using raw query to avoid type issues
    const users = await prisma.$queryRaw<Array<UserWithPassword>>`
      SELECT id, email, name, password 
      FROM "User" 
      WHERE email = ${email}
    `;
    const user = users[0] || null;

    // Check if user exists and password is correct
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (excluding password) and token
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;

    // Hash password
    const hashedPassword: string = await bcrypt.hash(password, 10);

    // Create user with proper typing
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });

    // Create JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      data: {
        user,
        token
      }
    });
  } catch (err) {
    // Handle duplicate email error
    if (err instanceof Error && 'code' in err && err.code === 'P2002') {
      return res.status(400).json({
        success: false,
        message: 'Email already in use'
      });
    }
    next(err);
  }
}

export async function getCurrentUser(req: Request, res: Response, next: NextFunction) {
  try {
    // The user is attached to the request by the auth middleware
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (err) {
    next(err);
  }
}
