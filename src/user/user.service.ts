import { PrismaService } from 'prisma/prisma.service'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

import type { User } from '@prisma/client'

@Injectable()
export class UserService {
	constructor(private readonly prisma: PrismaService) {}
	private readonly select = {
		id: true,
		name: true,
		last_name: true,
		email: true,
		roles: true,
		created_at: true,
		updated_at: true,
	}

	async getUsers() {
		return this.prisma.user.findMany({
			select: this.select,
		})
	}

	async getById(id: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				id: +id,
			},
		})
		if (!user) throw new NotFoundException('Пользователь не найден')
		return user
	}

	async getByEmail(email: string) {
		const user = await this.prisma.user.findUnique({
			where: {
				email,
			},
		})
		if (!user) throw new NotFoundException('Пользователь не найден')
		return user
	}

	async update(userId: string, data: Partial<User>) {
		const isExist = await this.prisma.user.findUnique({ where: { id: +userId } })
		if (!isExist) throw new NotFoundException(`Пользователя под ID ${userId} не существует`)

		// Проверка что текущее обновление роли не удалит единственного Админа
		if (data?.roles && !data.roles.includes('ADMIN') && isExist.roles.includes('ADMIN')) {
			const admins = await this.prisma.user.findMany({ where: { roles: { has: 'ADMIN' } } })
			const isNotHaveOtherAdmin = admins.length === 1
			if (isNotHaveOtherAdmin) {
				throw new ForbiddenException('Вы не можете удалить роль Админа - это единственный Админ в базе')
			}
		}

		return this.prisma.user.update({
			where: { id: +userId },
			data,
		})
	}

	async delete(userId: string) {
		const user = await this.prisma.user.findFirst({ where: { id: +userId } })
		if (!user) throw new NotFoundException('Пользователь не найден')

		// Проверка что текущее обновление роли не удалит единственного Админа
		const admins = await this.prisma.user.findMany({ where: { roles: { has: 'ADMIN' } } })
		const isNotHaveOtherAdmin = admins.length === 1
		if (isNotHaveOtherAdmin) {
			throw new ForbiddenException(
				'Вы не можете удалить пользователя, поскольку он - единственный администратор на сервере',
			)
		}

		return this.prisma.user.delete({ where: { id: +userId } })
	}
}
