import { HttpError } from "../../common/errors";
import { UsersRepository } from "./users.repository";
import type { CreateUserBody } from "./dto/create-user.dto";
import type { User } from "@prisma/client";

export class UsersService {
	constructor(private readonly usersRepository: UsersRepository) {}

	async create(input: CreateUserBody & { password: string }): Promise<User> {
		const existingUser = await this.usersRepository.findByEmail(input.email);
		if (existingUser) {
			throw new HttpError(409, "Bu email bilan foydalanuvchi allaqachon mavjud");
		}

		return this.usersRepository.create(input);
	}

	findByEmail(email: string): Promise<User | null> {
		return this.usersRepository.findByEmail(email);
	}
}

