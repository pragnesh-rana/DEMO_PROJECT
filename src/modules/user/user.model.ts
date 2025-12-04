
import { prisma } from "../../lib/prisma.js";

export async function findAllUsers() {
  return prisma.user.findMany();
}

export async function createUser(email: string, name: string | null = null) {
  return prisma.user.create({
    data: { email, name,password:"123456" }
  });
}
