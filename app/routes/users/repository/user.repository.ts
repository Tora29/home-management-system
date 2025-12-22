import { prisma } from "~/shared/lib/db.server";
import type { CreateUserInput, UpdateUserInput } from "../schema";

export async function findAll() {
  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function findById(id: string) {
  return prisma.user.findUnique({ where: { id } });
}

export async function create(data: CreateUserInput) {
  return prisma.user.create({
    data: { email: data.email, name: data.name ?? null },
  });
}

export async function update(id: string, data: Omit<UpdateUserInput, "id">) {
  return prisma.user.update({
    where: { id },
    data: {
      email: data.email,
      name: data.name ?? null,
    },
  });
}

export async function remove(id: string) {
  return prisma.user.delete({ where: { id } });
}
