import { PrismaService } from '../../prisma/prisma.service'
import { Module } from '@nestjs/common'

import { UserService } from './user.service'

import { UserController } from './user.controller'
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy'

@Module({
	controllers: [UserController],
	providers: [UserService, PrismaService, JwtStrategy],
	exports: [UserService],
})
export class UserModule {}
