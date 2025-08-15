import { Controller } from '@nestjs/common';
import { MessagePattern } from "@nestjs/microservices";
import { ProfessionsService } from "./professions.service";

@Controller('professions')
export class ProfessionsController {

  constructor(private readonly professionsService: ProfessionsService,
  ) {}

  @MessagePattern('getAll.professions')
  async getAllProfessions() {
    return  await this.professionsService.getAllProfessions();
  }
}
