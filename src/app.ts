import Fastify, { type FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import { env } from "./config/env";
import { prisma } from "./lib/prisma";
import { HttpError } from "./common/errors";
import { usersModule } from "./modules/users/users.module";
import { authModule } from "./modules/auth/auth.module";

export async function buildApp(): Promise<FastifyInstance> {
	const app = Fastify({ logger: true });

	await app.register(fastifyJwt, {
		secret: env.JWT_SECRET
	});

	const { usersService } = await usersModule(app, prisma);
	await authModule(app, prisma, usersService);

	app.get("/health", async () => ({ status: "ok" }));

	app.setErrorHandler((error, _request, reply) => {
		if (error instanceof HttpError) {
			return reply.status(error.statusCode).send({ message: error.message });
		}

		app.log.error(error);
		return reply.status(500).send({ message: "Internal server error" });
	});

	app.addHook("onClose", async () => {
		await prisma.$disconnect();
	});

	return app;
}

