import { Test, TestingModule } from "@nestjs/testing";
import { PersonsService } from "./persons.service";
import { ProfessionsService } from "../professions/professions.service";
import { Person } from "./persons.model";
import { Profession } from "../professions/professions.model";
import { getModelToken } from "@nestjs/sequelize";

describe("PersonsService", () => {
  let service: PersonsService;

  const mockPersonArray = [
    {
      id: 1,
      photoUrl: "test.jpg",
      nameRu: "Тест",
      nameEn: "Test",
      professions: [1, 2, 3],
    },
    {
      id: 2,
      photoUrl: "test2.jpg",
      nameRu: "Тест2",
      nameEn: "Test2",
      professions: [1, 3],
    },
  ];

  const mockProfessionsArray = [
    { id: 1, name: "Актёр" },
    { id: 2, name: "Режиссёр" },
    { id: 3, name: "Сценарист" },
  ];

  const mockPersonsRepository = {
    findAll: jest.fn().mockResolvedValue(mockPersonArray),
    findByPk: jest.fn().mockResolvedValue(mockPersonArray[0]),
    create: jest.fn().mockResolvedValue(mockPersonArray[0]),
    bulkCreate: jest.fn().mockResolvedValue(mockPersonArray),
  };

  const mockProfessionsService = {
    findProfessionByName: jest.fn().mockResolvedValue(mockProfessionsArray),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: getModelToken(Person),
          useValue: mockPersonsRepository,
        },
        {
          provide: ProfessionsService,
          useValue: mockProfessionsService,
        },
      ],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllPersons", () => {
    it("should return an array of persons", async () => {
      const result = await service.getAllPersons();
      expect(result).toEqual(mockPersonArray);
    });
  });

  describe("getPersonById", () => {
    it("should return a person by id", async () => {
      const result = await service.getPersonById(1);
      expect(result).toEqual(mockPersonArray[0]);
    });
  });

  describe("findPersonsByNameAndProfession", () => {
    it("should return persons by name and profession", async () => {
      const personName = "Тест";
      const professionId = 1;

      await service.findPersonsByNameAndProfession(personName, professionId);

      expect(mockPersonsRepository.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Profession,
            where: { id: professionId },
            through: { attributes: [] },
          },
        ],
        where: { nameRu: personName },
      });
    });
  });
});
