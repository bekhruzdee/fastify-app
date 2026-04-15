import type { FastifyInstance } from "fastify";
import type { PrismaClient } from "@prisma/client";
import { UsersRepository } from "./users.repository";
import { UsersService } from "./users.service";
import { usersController } from "./users.controller";

export type UsersModule = {
  usersRepository: UsersRepository;
  usersService: UsersService;
};

export async function usersModule(
  fastify: FastifyInstance,
  prisma: PrismaClient,
): Promise<UsersModule> {
  const usersRepository = new UsersRepository(prisma);
  const usersService = new UsersService(usersRepository);

  await fastify.register(usersController, { prefix: "/users" });

  return { usersRepository, usersService };
}
