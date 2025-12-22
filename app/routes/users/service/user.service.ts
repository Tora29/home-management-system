import { z } from "zod";
import {
  userSchema,
  createUserSchema,
  updateUserSchema,
  deleteUserSchema,
  type User,
} from "../schema";
import { ERROR_MESSAGES } from "../errorMessage";
import * as userRepository from "../repository/user.repository";

export class ValidationError extends Error {
  details: Record<string, string[]>;
  constructor(message: string, details: Record<string, string[]>) {
    super(message);
    this.name = "ValidationError";
    this.details = details;
  }
}

export class DuplicateEmailError extends Error {
  constructor() {
    super(ERROR_MESSAGES.email.duplicate);
    this.name = "DuplicateEmailError";
  }
}

export async function getUsers(): Promise<User[]> {
  const users = await userRepository.findAll();

  const result = z.array(userSchema).safeParse(users);
  if (!result.success) {
    throw new Error(ERROR_MESSAGES.general.dataFormatInvalid);
  }

  return result.data;
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await userRepository.findById(id);
  if (!user) return null;

  const result = userSchema.safeParse(user);
  if (!result.success) {
    throw new Error(ERROR_MESSAGES.general.dataFormatInvalid);
  }

  return result.data;
}

export async function createUser(input: unknown): Promise<User> {
  const result = createUserSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      ERROR_MESSAGES.general.validationError,
      result.error.flatten().fieldErrors as Record<string, string[]>
    );
  }

  try {
    return (await userRepository.create(result.data)) as User;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new DuplicateEmailError();
    }
    throw error;
  }
}

export async function updateUser(input: unknown): Promise<User> {
  const result = updateUserSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      ERROR_MESSAGES.general.validationError,
      result.error.flatten().fieldErrors as Record<string, string[]>
    );
  }

  const { id, ...data } = result.data;

  try {
    return (await userRepository.update(id, data)) as User;
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      throw new DuplicateEmailError();
    }
    throw new Error(ERROR_MESSAGES.general.updateFailed);
  }
}

export async function deleteUser(input: unknown): Promise<void> {
  const result = deleteUserSchema.safeParse(input);
  if (!result.success) {
    throw new ValidationError(
      ERROR_MESSAGES.general.validationError,
      result.error.flatten().fieldErrors as Record<string, string[]>
    );
  }

  await userRepository.remove(result.data.id);
}
