import { Injectable, NotFoundException } from '@nestjs/common'

import { UpdateDescriptionDto } from './dto/update-description.dto'
import { CreateDescriptionDto } from './dto/create-description.dto'

@Injectable()
export class DescriptionService {
	create(createDescriptionDto: CreateDescriptionDto) {
		const {} = createDescriptionDto
		return {
			description: `This action adds a new description (${createDescriptionDto.description}) to ${createDescriptionDto.id}`,
		}
	}

	findOne(id: string) {
		// throw new NotFoundException('description not found')
		return { id: id, description: `This action returns a #${id} description` }
	}

	update(updateDescriptionDto: UpdateDescriptionDto) {
		const { description, id } = updateDescriptionDto
		return { id: id, description }
	}

	remove(id: string) {
		return { id: id, description: `This action removes a #${id} description` }
	}
}
