import { DescriptionModule } from './description/description.module'
import { Module } from '@nestjs/common'

import { AppService } from './app.service'

import { AppController } from './app.controller'

@Module({
	imports: [DescriptionModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
