import { z } from "zod";

export const createUserBodySchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.email().trim().toLowerCase(),
  password: z.string().min(6).max(128),
});

export type CreateUserBody = z.infer<typeof createUserBodySchema>;
