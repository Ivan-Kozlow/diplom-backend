import { PrismaService } from 'prisma/prisma.service'
import { Role, User } from '@prisma/client'
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'

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
	private maxAdminsCount = 3

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

		if (data?.roles && data.roles.includes(Role.ADMIN)) {
			const allAdmins = await this.prisma.user.findMany({ where: { roles: { has: 'ADMIN' } } })

			if (allAdmins.length >= this.maxAdminsCount)
				throw new ForbiddenException(
					`Пользователей с ролью admin не может быть больше ${this.maxAdminsCount}`,
				)
		}

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
