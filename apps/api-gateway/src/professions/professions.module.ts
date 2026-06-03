import { Module } from '@nestjs/common';

import { ProfessionsController } from './professions.controller';
import { ProfessionsService } from './services';

@Module({
  controllers: [ProfessionsController],
  providers: [ProfessionsService],
  exports: [ProfessionsService],
})
export class ProfessionsModule {}
