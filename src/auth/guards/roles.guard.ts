import { Role, User } from '@prisma/client'
import { Reflector } from '@nestjs/core'
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common'

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const roles = this.reflector.get<Role[]>('roles', context.getHandler())
		if (!roles) {
			return true
		}

		const request = context.switchToHttp().getRequest()
		const user = request.user as User

		const hasRole = () => user.roles.some((role) => roles.includes(role))
		if (!hasRole()) {
			throw new ForbiddenException('У тебя нет прав!')
		}

		return true
	}
}
