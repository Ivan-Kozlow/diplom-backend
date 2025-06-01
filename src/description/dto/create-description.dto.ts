import { IsNotEmpty, IsString } from 'class-validator'

export class CreateDescriptionDto {
	@IsString({
		message: 'Год создания должно быть строкой',
	})
	@IsNotEmpty({
		message: 'Год создания не должно быть пустым',
	})
	year_created: string

	@IsString({
		message: 'Издательство должно быть строкой',
	})
	@IsNotEmpty({
		message: 'Издательство не должно быть пустым',
	})
	publisher: string

	@IsString({
		message: 'Имя книги должно быть строкой',
	})
	@IsNotEmpty({
		message: 'Имя книги не должно быть пустым',
	})
	book_name: string

	@IsString({
		message: 'Жанр книги должно быть строкой',
	})
	@IsNotEmpty({
		message: 'Жанр книги не должно быть пустым',
	})
	book_genre: string

	@IsString({
		message: 'Автор книги должно быть строкой',
	})
	@IsNotEmpty({
		message: 'Автор книги не должно быть пустым',
	})
	author: string

	uid: string
}
