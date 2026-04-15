import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { AuthRepository } from "./auth.repository";
import { AuthService } from "./auth.service";
import { authController } from "./auth.controller";
import type { UsersService } from "../users/users.service";

export async function authModule(
	fastify: FastifyInstance,
	prisma: PrismaClient,
	usersService: UsersService
): Promise<void> {
	const authRepository = new AuthRepository(prisma);
	const authService = new AuthService(authRepository, usersService);

	await fastify.register(
		async (authScope) => {
			await authController(authScope, { authService });
		},
		{ prefix: "/auth" }
	);
}

