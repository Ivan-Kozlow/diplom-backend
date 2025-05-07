import { Role } from '@prisma/client'
import { UseGuards, applyDecorators } from '@nestjs/common'

import { Roles } from './roles.decorator'
import { RolesGuard } from '../guards/roles.guard'
import { JwtAuthGuard } from '../guards/jwt.guard'

export const Auth = (roles: Role | Role[] = [Role.USER]) => {
	if (!Array.isArray(roles)) {
		roles = [roles]
	}
	return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard))
}
