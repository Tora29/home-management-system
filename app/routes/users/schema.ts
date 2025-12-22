import { z } from "zod";
import { ERROR_MESSAGES } from "./errorMessage";

export const userSchema = z.object({
  id: z.string(),
  email: z.email(),
  name: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createUserSchema = z.object({
  email: z.email({ message: ERROR_MESSAGES.email.invalid }).min(1, ERROR_MESSAGES.email.required),
  name: z.string().max(100, ERROR_MESSAGES.name.maxLength).optional(),
});

export const updateUserSchema = z.object({
  id: z.string().min(1, ERROR_MESSAGES.id.required),
  email: z.email({ message: ERROR_MESSAGES.email.invalid }).min(1, ERROR_MESSAGES.email.required),
  name: z.string().max(100, ERROR_MESSAGES.name.maxLength).optional(),
});

export const deleteUserSchema = z.object({
  id: z.string().min(1, ERROR_MESSAGES.id.required),
});

export type User = z.infer<typeof userSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type DeleteUserInput = z.infer<typeof deleteUserSchema>;
