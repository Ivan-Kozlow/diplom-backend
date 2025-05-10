import { PrismaService } from '../../prisma/prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'

import { RefreshTokenService } from './refresh-token.service'
import { AuthService } from './auth.service'
import { UserService } from '../user/user.service'

import { JwtStrategy } from './strategies/jwt.strategy'
import { AuthController } from './auth.controller'
import { getJwtConfig } from '../config/jwt.config'

@Module({
	controllers: [AuthController],
	providers: [JwtStrategy, AuthService, PrismaService, RefreshTokenService, UserService],
	exports: [RefreshTokenService],
	imports: [
		ConfigModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: getJwtConfig,
		}),
	],
})
export class AuthModule {}
