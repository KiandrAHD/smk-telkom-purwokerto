import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

export const registerSchema = z.object({
  email: z.string().email().max(254),
  password: z.string().min(8).max(200),
});

export const passwordResetSchema = z.object({
  email: z.string().email().max(254),
});

export const passwordUpdateSchema = z.object({
  password: z.string().min(8).max(200),
});

export const verifyEmailSchema = z.object({
  token: z.string().min(10).max(500),
});
