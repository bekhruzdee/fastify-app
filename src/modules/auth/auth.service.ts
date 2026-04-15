import bcrypt from "bcryptjs";
import { HttpError } from "../../common/errors";
import { UsersService } from "../users/users.service";
import { AuthRepository } from "./auth.repository";
import type { CreateUserBody } from "../users/dto/create-user.dto";
import type { LoginBody } from "./dto/login.dto";
import type { User } from "@prisma/client";

export class AuthService {
	constructor(
		private readonly authRepository: AuthRepository,
		private readonly usersService: UsersService
	) {}

	async register(payload: CreateUserBody): Promise<User> {
		const passwordHash = await bcrypt.hash(payload.password, 10);
		return this.usersService.create({
			name: payload.name,
			email: payload.email,
			password: passwordHash
		});
	}

	async login(payload: LoginBody): Promise<User> {
		const user = await this.authRepository.findByEmail(payload.email);
		if (!user) {
			throw new HttpError(401, "Email yoki parol noto'g'ri");
		}

		const isPasswordCorrect = await bcrypt.compare(payload.password, user.password);
		if (!isPasswordCorrect) {
			throw new HttpError(401, "Email yoki parol noto'g'ri");
		}

		return user;
	}
}

