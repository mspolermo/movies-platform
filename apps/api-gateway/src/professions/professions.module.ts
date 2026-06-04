import { Module } from '@nestjs/common';

import { ProfessionsClient } from './clients';
import { ProfessionsController } from './controllers/professions.controller';
import { ProfessionsService } from './services';

@Module({
  controllers: [ProfessionsController],
  providers: [ProfessionsService, ProfessionsClient],
  exports: [ProfessionsService],
})
export class ProfessionsModule {}
