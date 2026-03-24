import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/messaging";

import { ProfessionsService } from "./professions.service";

@Controller("professions")
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @MessagePattern(kinoDbRpc.professions.getAll)
  async getAllProfessions() {
    return await this.professionsService.getAllProfessions();
  }
}
