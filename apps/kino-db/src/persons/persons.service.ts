import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Person } from "./persons.model";
import { ProfessionsService } from "../professions/professions.service";
import { TProfessionModel, TProfessionBased } from "@common/types";
import { Profession } from "../professions/professions.model";
import { Op } from "sequelize";

@Injectable()
export class PersonsService {
  constructor(
    @InjectModel(Person) private personRepository: typeof Person,
    private professionService: ProfessionsService
  ) {}

  async getAllPersons(): Promise<Person[]> {
    const persons = await this.personRepository.findAll({
      include: [
        {
          model: Profession,
          through: { attributes: [] },
        },
      ],
      attributes: ['id', 'photoUrl', 'nameRu', 'nameEn'],
      limit: 10
    });
    return persons;
  }

  async getPersonById(id: number): Promise<Person | null> {
    const person = await this.personRepository.findByPk(id, {
      include: [
        {
          model: Profession,
          through: { attributes: [] },
        },
      ],
    });
    return person;
  }

  async findPersonsByNameAndProfession(
    personName?: string,
    professionId?: number
  ): Promise<Person[]> {
    const include: any[] = [
      {
        model: Profession,
        through: { attributes: [] },
      },
    ];

    // Добавляем условие для профессии только если professionId передан
    if (professionId) {
      include[0].where = { id: professionId };
    }

    const persons = await this.personRepository.findAll({
      include,
      where: personName ? { 
        nameRu: {
          [Op.iLike]: `%${personName}%`
        }
      } : {},
    });
    return persons;
  }

  async createPerson(dto: { photoUrl: string; nameRu: string; nameEn: string; professions?: TProfessionBased[] }): Promise<Person> {
    const person = await this.personRepository.create(dto);
    if (dto.professions && dto.professions.length > 0) {
      const professionsNames = dto.professions.map((p: TProfessionBased) => p.name);
      const professions = await this.professionService.findProfessionByName(
        professionsNames
      );
      if (professions.some(p => p === null)) {
        throw new Error("One or more professions not found");
      }
      const professionIds = professions.map((p: TProfessionModel) => p.id);
      await person.$set("professions", professionIds);
      // Приводим к правильному типу для Sequelize модели
      person.professions = professions as Profession[];
    }
    return person;
  }

  async createManyPersons(dtos: { photoUrl: string; nameRu: string; nameEn: string; professions?: TProfessionBased[] }[]): Promise<Person[]> {
    const persons = await this.personRepository.bulkCreate(dtos);
    if (dtos.some((dto) => dto.professions && dto.professions.length > 0)) {
      const professionsNames = dtos.flatMap((p) =>
        p.professions?.map((pr: TProfessionBased) => pr.name) || []
      );
      const professions = await this.professionService.findProfessionByName(
        professionsNames
      );
      if (professions.some(p => p === null)) {
        throw new Error("One or more professions not found");
      }
      const professionIds = professions.map((p: TProfessionModel) => p.id);
      for (const person of persons) {
        await person.$set("professions", professionIds);
      }
    }
    return persons;
  }
}
