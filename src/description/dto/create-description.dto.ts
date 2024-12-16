import { IsNotEmpty, IsString } from 'class-validator'

export class CreateDescriptionDto {
	@IsString({
		message: 'description must be a string',
	})
	@IsNotEmpty({
		message: 'description cannot be empty',
	})
	description: string

	@IsString({
		message: 'id must be a string',
	})
	@IsNotEmpty({
		message: 'id cannot be empty',
	})
	id: string
}
