import type { PrismaClient, User } from "@prisma/client";

type CreateUserInput = {
	name: string;
	email: string;
	password: string;
};

export class UsersRepository {
	constructor(private readonly prisma: PrismaClient) {}

	findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { email } });
	}

	create(data: CreateUserInput): Promise<User> {
		return this.prisma.user.create({ data });
	}
}

