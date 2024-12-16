import { PrismaService } from 'prisma/prisma.service'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { UpdateDescriptionDto } from './dto/update-description.dto'
import { CreateDescriptionDto } from './dto/create-description.dto'

@Injectable()
export class DescriptionService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createDescriptionDto: CreateDescriptionDto) {
		const { id, description } = createDescriptionDto

		const isExist = await this.prisma.marks.findUnique({ where: { markId: id } })
		if (isExist) throw new ConflictException('description already exists')

		return this.prisma.marks.create({ data: { markId: id, description } })
	}

	async findOne(id: string) {
		const { description, markId } = await this.prisma.marks.findUnique({ where: { markId: id } })
		if (!markId && !description) throw new NotFoundException('description not found')

		return { id: markId, description }
	}

	async update(updateDescriptionDto: UpdateDescriptionDto) {
		const { id, description } = updateDescriptionDto

		const isExist = await this.prisma.marks.findUnique({ where: { markId: id } })
		if (!isExist) throw new NotFoundException('description not found')

		const newItem = await this.prisma.marks.update({ where: { markId: id }, data: { description } })
		if (!newItem.markId && !description) throw new NotFoundException('description not found')
		return { id: newItem.markId, description: newItem.description }
	}

	async remove(id: string) {
		const { markId, description } = await this.prisma.marks.delete({ where: { markId: id } })
		return { id: markId, description }
	}
}
