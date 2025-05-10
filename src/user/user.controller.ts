import { Role, User } from '@prisma/client'
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common'

import { UserService } from './user.service'

import { omit } from 'lodash'
import { Auth } from '../auth/decorators/auth.decorator'
import { CurrentUser } from '../auth/decorators/user.decorator'

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	buildResponseObject(user: User): Promise<Omit<User, 'password'>> {
		return omit(user, ['password'])
	}

	@Auth()
	@Get('profile')
	async getProfile(@CurrentUser('id') id: string, @CurrentUser('email') email: string) {
		if (email) {
			const user = await this.userService.getByEmail(email)
			return this.buildResponseObject(user)
		}
		const user = await this.userService.getById(id)
		return this.buildResponseObject(user)
	}

	@Auth('ADMIN')
	@Get('list')
	async getList() {
		return this.userService.getUsers()
	}

	@Auth('ADMIN')
	@Patch('update/:userId')
	async update(@Body() data: Partial<User>, @Param('userId') userId: string) {
		const userData: Partial<User> = { ...data }
		if (userData.roles) {
			if (!userData.roles.includes(Role.USER)) {
				userData.roles.push(Role.USER)
			}
		}
		const user = await this.userService.update(userId, userData)
		return this.buildResponseObject(user)
	}

	@Auth('ADMIN')
	@Post('delete/:userId')
	async delete(@Param('userId') userId: string) {
		return this.userService.delete(userId)
	}
}
