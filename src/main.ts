import { AppModule } from './app.module'
import { NestFactory } from '@nestjs/core'

import cookieParser from 'cookie-parser'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)

	app.use(cookieParser())
	app.enableCors({
		// origin: [process.env.FRONT_URL || 'http://localhost:5173'],
		credentials: true,
		exposedHeaders: 'set-cookie',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
	})

	await app.listen(process.env.PORT || 4200)
}
bootstrap()
