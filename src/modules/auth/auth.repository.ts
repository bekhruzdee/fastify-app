import type { PrismaClient, User } from "@prisma/client";

export class AuthRepository {
	constructor(private readonly prisma: PrismaClient) {}

	findByEmail(email: string): Promise<User | null> {
		return this.prisma.user.findUnique({ where: { email } });
	}
}

