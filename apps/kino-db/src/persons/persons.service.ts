import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Person } from "./persons.model";
import { ProfessionsService } from "../professions/professions.service";
import { TProfessionModel, TProfessionBased } from "@common/types";
import { Profession } from "../professions/professions.model";

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

  async getPersonById(id: number): Promise<Person> {
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
    const persons = await this.personRepository.findAll({
      include: [
        {
          model: Profession,
          where: { id: professionId },
          through: { attributes: [] },
        },
      ],
      where: personName ? { nameRu: personName } : {},
    });
    return persons;
  }

  async createPerson(dto: any): Promise<Person> {
    const person = await this.personRepository.create(dto);
    if (dto.professions && dto.professions.length > 0) {
      const professionsNames = dto.professions.map((p: TProfessionBased) => p.name);
      const professions = await this.professionService.findProfessionByName(
        professionsNames
      );
      if (professions.includes(null)) {
        throw new Error("One or more professions not found");
      }
      const professionIds = professions.map((p: TProfessionModel) => p.id);
      await person.$set("professions", professionIds);
      person.professions = professions as any;
    }
    return person;
  }

  async createManyPersons(dtos: any[]): Promise<Person[]> {
    const persons = await this.personRepository.bulkCreate(dtos);
    if (dtos.some((dto) => dto.professions && dto.professions.length > 0)) {
      const professionsNames = dtos.flatMap((p: any) =>
        p.professions.map((pr: TProfessionBased) => pr.name)
      );
      const professions = await this.professionService.findProfessionByName(
        professionsNames
      );
      if (professions.includes(null)) {
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
