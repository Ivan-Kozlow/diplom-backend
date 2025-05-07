import { IsEmail, IsString, MinLength } from 'class-validator'

export class LoginDto {
	@IsEmail(undefined, { message: 'Некорректный email, значение не должно быть пустым' })
	email: string

	@MinLength(6, {
		message: 'Пароль должен содержать не менее 6 символов',
	})
	@IsString({ message: 'Пароль должен быть строкой' })
	password: string
}
