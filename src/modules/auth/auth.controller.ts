import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";
import { HttpError } from "../../common/errors";
import { createUserBodySchema } from "../users/dto/create-user.dto";
import { loginBodySchema } from "./dto/login.dto";
import { AuthService } from "./auth.service";

type AuthControllerDeps = {
	authService: AuthService;
};

function serializeAuthUser(user: { id: string; name: string; email: string; createdAt: Date }) {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		createdAt: user.createdAt.toISOString()
	};
}

export async function authController(fastify: FastifyInstance, deps: AuthControllerDeps): Promise<void> {
	fastify.post("/register", async (request, reply) => {
		try {
			const payload = createUserBodySchema.parse(request.body);
			const user = await deps.authService.register(payload);
			const accessToken = await reply.jwtSign({ sub: user.id, email: user.email });

			return reply.code(201).send({
				accessToken,
				user: serializeAuthUser(user)
			});
		} catch (error) {
			if (error instanceof ZodError) {
				throw new HttpError(400, "Yuborilgan ma'lumotlar noto'g'ri");
			}

			throw error;
		}
	});

	fastify.post("/login", async (request, reply) => {
		try {
			const payload = loginBodySchema.parse(request.body);
			const user = await deps.authService.login(payload);
			const accessToken = await reply.jwtSign({ sub: user.id, email: user.email });

			return reply.send({
				accessToken,
				user: serializeAuthUser(user)
			});
		} catch (error) {
			if (error instanceof ZodError) {
				throw new HttpError(400, "Yuborilgan ma'lumotlar noto'g'ri");
			}

			throw error;
		}
	});
}

