import { PrismaService } from 'src/../prisma/prisma.service'
import { Role, User } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'

import { UserService } from 'src/user/user.service'

import { hash, verify } from 'argon2'
import { omit } from 'lodash'
import { AuthDto } from './dto/auth.dto'

import type { LoginDto } from './dto/login.dto'
import type { TokenDataDto } from './dto/token.dto'

const adminEmail = 'admin@mail.ru'

@Injectable()
export class AuthService {
	constructor(
		private jwt: JwtService,
		private userService: UserService,
		private prisma: PrismaService,
	) {}

	private readonly TOKEN_EXPIRATION_ACCESS = '1h'
	private readonly TOKEN_EXPIRATION_REFRESH = '7d'

	async login(dto: LoginDto) {
		if (dto.email === adminEmail) {
			const isExist = await this.prisma.user.findUnique({ where: { email: adminEmail } })
			if (!isExist) {
				this.prisma.user.create({
					data: {
						email: dto.email,
						name: 'Admin',
						last_name: 'Admin',
						password: await hash(dto.password),
						roles: [Role.ADMIN],
					},
				})
			}
		}
		const user = await this.validateUser(dto)
		return this.buildResponseObject(user)
	}

	async register(dto: AuthDto) {
		const userExists = await this.prisma.user.findUnique({
			where: {
				email: dto.email,
			},
		})

		if (userExists) {
			throw new BadRequestException('Пользователь с таким email уже существует')
		}
		const user = await this.prisma.user.create({
			data: {
				email: dto.email,
				name: dto.name,
				last_name: dto.last_name,
				password: await hash(dto.password),
				roles: dto.roles,
			},
		})

		return this.buildResponseObject(user)
	}

	async getNewTokens(refreshToken: string) {
		const result = await this.jwt.verifyAsync(refreshToken, {
			secret: process.env.JWT_SECRET,
		})
		if (!result) {
			throw new UnauthorizedException('Не валидный токен авторизации')
		}
		const user = await this.userService.getById(result.id)
		return this.buildResponseObject(user)
	}

	async buildResponseObject(user: User) {
		const tokens = await this.issueTokens({
			userId: user.id.toString(),
			roles: user.roles,
		})
		return { user: this.omitPassword(user), ...tokens }
	}

	private async issueTokens(payload: TokenDataDto) {
		const accessToken = this.jwt.sign(payload, {
			expiresIn: this.TOKEN_EXPIRATION_ACCESS,
		})
		const refreshToken = this.jwt.sign(payload, {
			expiresIn: this.TOKEN_EXPIRATION_REFRESH,
		})
		return { accessToken, refreshToken }
	}

	private async validateUser(dto: LoginDto) {
		const user = await this.userService.getByEmail(dto.email)
		if (!user) {
			throw new UnauthorizedException('Email или пароль неверны')
		}
		const isValid = await verify(user.password, dto.password)
		if (!isValid) {
			throw new UnauthorizedException('Email или пароль неверны')
		}
		return user
	}

	private omitPassword(user: User) {
		return omit(user, ['password'])
	}
}
