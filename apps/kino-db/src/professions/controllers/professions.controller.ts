import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";
import { TProfessionItemResponse } from "@common/types";

import { ProfessionsService } from "../services/professions.service";

@Controller("professions")
export class ProfessionsController {
  constructor(private readonly professionsService: ProfessionsService) {}

  @MessagePattern(kinoDbRpc.professions.getAll)
  async getAllProfessions(): Promise<TProfessionItemResponse[]> {
    return this.professionsService.getAllProfessions();
  }
}
