import { PrismaService } from 'prisma/prisma.service'
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'

import { UpdateDescriptionDto } from './dto/update-description.dto'
import { CreateDescriptionDto } from './dto/create-description.dto'

@Injectable()
export class DescriptionService {
	constructor(private prisma: PrismaService) {}

	async create(createDescriptionDto: CreateDescriptionDto) {
		const { uid, description } = createDescriptionDto
		const isExist = await this.prisma.mark.findUnique({ where: { uid } })
		if (isExist) throw new ConflictException('Метка с таким id уже существует')

		return this.prisma.mark.create({
			data: { uid, description },
		})
	}

	async findMany(uid: string) {
		const finedMarks = await this.prisma.mark.findUnique({ where: { uid } })
		if (!finedMarks) throw new NotFoundException('Описание не найдено')
		return finedMarks
	}

	async update(updateDescriptionDto: UpdateDescriptionDto) {
		const { uid, description } = updateDescriptionDto
		const isExist = await this.prisma.mark.findUnique({ where: { uid } })
		if (!isExist) throw new NotFoundException('Описание не найдено')

		const newItem = await this.prisma.mark.update({
			where: { uid },
			data: { description },
		})

		return newItem
	}

	async remove(id: string) {
		const isExist = await this.prisma.mark.findUnique({ where: { uid: id } })
		if (!isExist) throw new NotFoundException('Описание не найдено')

		const { uid, description } = await this.prisma.mark.delete({
			where: { uid: id },
		})
		return { id: uid, description }
	}
}
