import { Request, Response } from 'express'
import {
	Body,
	Controller,
	HttpCode,
	Post,
	Req,
	Res,
	UnauthorizedException,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'

import { RefreshTokenService } from './refresh-token.service'
import { AuthService } from './auth.service'

import { AuthDto } from './dto/auth.dto'

import type { LoginDto } from './dto/login.dto'

@Controller('auth')
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly refreshTokenService: RefreshTokenService,
	) {}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('login')
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const { refreshToken, ...response } = await this.authService.login(dto)
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
		return response
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('register')
	async register(@Body() dto: AuthDto, @Res({ passthrough: true }) res: Response) {
		const { user } = await this.authService.register(dto)
		return user
	}

	@HttpCode(200)
	@Post('access-token')
	async getNewTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		const refreshTokenFromCookies = req.cookies[this.refreshTokenService.REFRESH_TOKEN_NAME]

		if (!refreshTokenFromCookies) {
			this.refreshTokenService.removeRefreshTokenFromResponse(res)
			throw new UnauthorizedException('Токен авторизации не подходит')
		}

		const { refreshToken, ...response } = await this.authService.getNewTokens(refreshTokenFromCookies)
		this.refreshTokenService.addRefreshTokenToResponse(res, refreshToken)
		return response
	}

	@HttpCode(200)
	@Post('logout')
	async logout(@Res({ passthrough: true }) res: Response) {
		this.refreshTokenService.removeRefreshTokenFromResponse(res)
		return { message: true }
	}
}
