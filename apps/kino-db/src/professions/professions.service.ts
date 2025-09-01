import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { TProfessionModel } from "@common";
import { Profession } from "./professions.model";

@Injectable()
export class ProfessionsService {
  constructor(
    @InjectModel(Profession) private professionRepository: typeof Profession
  ) {}

  async getAllProfessions(): Promise<TProfessionModel[]> {
    const professions = await this.professionRepository.findAll({
      attributes: ["id", "name"],
    });
    return professions;
  }

  async findProfessionByName(professionsNames: string[]): Promise<TProfessionModel[]> {
    const professions = await this.professionRepository.findAll({
      where: {
        name: professionsNames,
      },
    });
    return professions;
  }
}
