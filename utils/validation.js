import { z } from "zod";

export const createAccountValidation = z.object({
  userName: z.string().trim(),
  firstName: z.string().min(1).max(12),
  lastName: z.string().min(1).max(12).trim(),
  email: z.email(),
  password: z.string().min(8),
});
