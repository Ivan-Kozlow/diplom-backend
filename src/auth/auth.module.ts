import { PrismaService } from '../../prisma/prisma.service'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Module } from '@nestjs/common'

import { RefreshTokenService } from './refresh-token.service'
import { AuthService } from './auth.service'
import { UserService } from 'src/user/user.service'

import { getJwtConfig } from 'src/config/jwt.config'
import { AuthController } from './auth.controller'
import { JwtStrategy } from './strategies/jwt.strategy'

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
