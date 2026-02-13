import { z } from 'zod';

export const usernameValiation = z.string().min(8, "Username must be at least 3 characters long")
    .max(30, "Username must be at most 30 characters long")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores");

export const emailValidation = z.string().email("Invalid email address");

export const passwordValidation = z.string().min(8, "Password must be at least 8 characters long").max(150, "Password must be at most 15 characters long").regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[^A-Za-z0-9]/, "Must include at least one special character");