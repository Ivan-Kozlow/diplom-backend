import { PrismaService } from 'prisma/prisma.service'
import { Module } from '@nestjs/common'

import { DescriptionService } from './description.service'

import { DescriptionController } from './description.controller'

@Module({
	controllers: [DescriptionController],
	providers: [PrismaService, DescriptionService],
})
export class DescriptionModule {}
