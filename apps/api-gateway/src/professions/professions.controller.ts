import { Controller, Get } from '@nestjs/common';
import { ProfessionsService } from './professions.service';

@Controller('professions')
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @Get()
  async getAllProfessions() {
    return await this.professionsService.getAllProfessions();
  }
}
