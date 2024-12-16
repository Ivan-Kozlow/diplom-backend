import { Module } from '@nestjs/common';
import { DescriptionService } from './description.service';
import { DescriptionController } from './description.controller';

@Module({
  controllers: [DescriptionController],
  providers: [DescriptionService],
})
export class DescriptionModule {}
