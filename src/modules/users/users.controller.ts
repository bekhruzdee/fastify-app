import type { FastifyInstance } from "fastify";
import { HttpError } from "../../common/errors";

export async function usersController(fastify: FastifyInstance): Promise<void> {
	fastify.get("/me", async (request, reply) => {
		try {
			await request.jwtVerify();
			return reply.send({ user: request.user });
		} catch {
			throw new HttpError(401, "Token noto'g'ri yoki muddati tugagan");
		}
	});
}

