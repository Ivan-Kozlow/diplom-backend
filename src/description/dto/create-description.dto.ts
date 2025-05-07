import { IsBoolean, IsNotEmpty, IsString } from 'class-validator'

export class CreateDescriptionDto {
	@IsString({
		message: 'Описание должно быть строкой',
	})
	@IsNotEmpty({
		message: 'Описание не должно быть пустым',
	})
	description: string

	@IsNotEmpty({
		message: 'id не должно быть пустым',
	})
	@IsString({
		message: 'id должно быть строкой',
	})
	uid: string
}
