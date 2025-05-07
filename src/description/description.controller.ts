import { Request, Response } from 'express'
import {
	Body,
	Controller,
	Delete,
	Get,
	Inject,
	Param,
	Patch,
	Post,
	Req,
	Res,
	UnauthorizedException,
} from '@nestjs/common'

import { DescriptionService } from './description.service'
import { RefreshTokenService } from 'src/auth/refresh-token.service'

import { UpdateDescriptionDto } from './dto/update-description.dto'
import { CreateDescriptionDto } from './dto/create-description.dto'
import { Auth } from 'src/auth/decorators/auth.decorator'

@Controller('description')
export class DescriptionController {
	constructor(private readonly descriptionService: DescriptionService) {}

	@Auth()
	@Get(':id')
	async findOne(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
		return this.descriptionService.findMany(id)
	}

	@Auth()
	@Post(':id')
	async create(
		@Res() res: Response,
		@Body() createDescriptionDto: CreateDescriptionDto,
		@Param('id') id: string,
	) {
		const { description } = createDescriptionDto
		const result = await this.descriptionService.create({ description, uid: id })
		return res.json(result)
	}

	@Auth()
	@Patch(':id')
	async update(
		@Body() updateDescriptionDto: UpdateDescriptionDto,
		@Param('id') id: string,
		@Res({ passthrough: true }) res: Response,
	) {
		const { description } = updateDescriptionDto
		return this.descriptionService.update({ uid: id, description })
	}

	@Auth()
	@Delete(':id')
	async remove(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
		const result = await this.descriptionService.remove(id)
		return res.json(result)
	}
}
