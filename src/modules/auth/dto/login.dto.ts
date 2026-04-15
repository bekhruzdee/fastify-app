import { z } from "zod";

export const loginBodySchema = z.object({
	email: z.email().trim().toLowerCase(),
	password: z.string().min(6).max(128)
});

export type LoginBody = z.infer<typeof loginBodySchema>;

