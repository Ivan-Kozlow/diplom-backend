import { Response } from 'express'
import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	Res,
	UsePipes,
	ValidationPipe,
} from '@nestjs/common'

import { DescriptionService } from './description.service'

import { UpdateDescriptionDto } from './dto/update-description.dto'
import { CreateDescriptionDto } from './dto/create-description.dto'
import { Auth } from '../auth/decorators/auth.decorator'

@Controller('description')
export class DescriptionController {
	constructor(private readonly descriptionService: DescriptionService) {}

	@Auth()
	@Get(':id')
	async findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
		return this.descriptionService.findMany(id)
	}

	@Auth('ADMIN')
	@Post(':id')
	@UsePipes(new ValidationPipe())
	async create(
		@Res() res: Response,
		@Body() createDescriptionDto: CreateDescriptionDto,
		@Param('id') id: string,
	) {
		const { year_created, publisher, book_name, book_genre, author } = createDescriptionDto
		const result = await this.descriptionService.create({
			year_created,
			publisher,
			book_name,
			book_genre,
			author,
			uid: id,
		})
		return res.json(result)
	}

	@Auth()
	@Patch(':id')
	@UsePipes(new ValidationPipe())
	async update(@Body() updateDescriptionDto: UpdateDescriptionDto, @Param('id') id: string) {
		const { recipient, checkout_date } = updateDescriptionDto
		return this.descriptionService.update({ uid: id, recipient, checkout_date })
	}

	@Auth()
	@Delete(':id')
	async remove(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
		const result = await this.descriptionService.remove(id)
		return res.json(result)
	}
}
