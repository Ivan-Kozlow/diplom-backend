import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DescriptionModule } from './description/description.module';

@Module({
  imports: [DescriptionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
