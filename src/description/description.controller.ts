import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common'

import { DescriptionService } from './description.service'

import { UpdateDescriptionDto } from './dto/update-description.dto'
import { CreateDescriptionDto } from './dto/create-description.dto'

@Controller('description')
export class DescriptionController {
	constructor(private readonly descriptionService: DescriptionService) {}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.descriptionService.findOne(id)
	}

	@Post(':id')
	create(@Body() createDescriptionDto: CreateDescriptionDto, @Param('id') id: string) {
		const { description } = createDescriptionDto
		return this.descriptionService.create({ description, id })
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateDescriptionDto: UpdateDescriptionDto) {
		const { description } = updateDescriptionDto
		return this.descriptionService.update({ id, description })
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.descriptionService.remove(id)
	}
}
