import { Role } from '@prisma/client'

import { IsString } from 'class-validator'

export class TokenDataDto {
	@IsString({ message: 'id пользователя должен быть строкой' })
	userId: string

	@IsString({ message: 'роли должны быть строкой' })
	roles: Role[]
}
