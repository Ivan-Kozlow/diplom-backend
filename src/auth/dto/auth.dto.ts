import type { Role } from '@prisma/client'
import { IsEmail, IsString, MinLength } from 'class-validator'

export class AuthDto {
	@IsEmail(undefined, { message: 'Некорректный email, значение не должно быть пустым' })
	email: string

	@MinLength(6, {
		message: 'Пароль должен содержать не менее 6 символов',
	})
	@IsString({ message: 'Пароль должен быть строкой' })
	password: string

	@MinLength(2, {
		message: 'Имя должно содержать не менее 2 символов',
	})
	@IsString({ message: 'Имя должно быть строкой' })
	name: string

	@IsString({ message: 'Фамилия должна быть строкой' })
	last_name: string

	roles?: Role[]
}
