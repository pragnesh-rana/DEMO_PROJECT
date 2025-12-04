import { prisma } from "../../lib/prisma.js";

type UserCreateInput = {
  email: string;
  name: string;
  password: string;
};

export async function getUserByIdService(id: number) {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function createUserService(data: UserCreateInput) {
  return prisma.user.create({
    data: {
      email: data.email,
      name: data.name,
      password: data.password,
    },
    select: {
      id: true,
      email: true,
      name: true
    }
  });
}

export async function updateUserService(id: number, data: Partial<UserCreateInput>) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
    },
  });
}

export async function deleteUserService(id: number) {
  return prisma.user.delete({
    where: { id },
    select: {
      id: true,
    },
  });
}