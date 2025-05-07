import { UserModule } from './user/user.module'
import { DescriptionModule } from './description/description.module'
import { AuthModule } from './auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { Module } from '@nestjs/common'

import { AppService } from './app.service'

import { AppController } from './app.controller'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		DescriptionModule,
		AuthModule,
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
