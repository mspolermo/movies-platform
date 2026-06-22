import type { TProfessionItemResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";

import { mapProfessionToItem } from "../mappers";
import { Profession } from "../models/professions.model";

@Injectable()
export class ProfessionsService {
  constructor(
    @InjectModel(Profession) private professionRepository: typeof Profession
  ) {}

  async getAllProfessions(): Promise<TProfessionItemResponse[]> {
    const professions =
      await this.professionRepository.findAll({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
      });
  
    return professions.map(mapProfessionToItem);
  }
}
