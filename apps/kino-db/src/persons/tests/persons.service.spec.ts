import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Op } from "sequelize";

import { Profession } from "../../professions/professions.model";
import { Person } from "../persons.model";
import { PersonsService } from "../persons.service";


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

  const mockFilms = [
    {
      id: 10,
      smallPictureUrl: "film.jpg",
      filmNameRu: "Фильм 1",
      filmNameEn: "Film 1",
      year: 2020,
      ratingKp: 7.5,
    },
  ];

  const mockPersonInstance = {
    ...mockPersonArray[0],
    get: jest.fn().mockReturnValue(mockPersonArray[0]),
    $count: jest.fn().mockResolvedValue(mockFilms.length),
    $get: jest.fn().mockResolvedValue(mockFilms),
  };

  const mockPersonsRepository = {
    findAll: jest.fn().mockResolvedValue(mockPersonArray),
    findByPk: jest.fn().mockResolvedValue(mockPersonInstance),
    count: jest.fn().mockResolvedValue(mockPersonArray.length),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsService,
        {
          provide: getModelToken(Person),
          useValue: mockPersonsRepository,
        },
      ],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllPersonsPaginated", () => {
    it("should return paginated persons response", async () => {
      const result = await service.getAllPersonsPaginated(1, 20);
      expect(mockPersonsRepository.findAll).toHaveBeenCalledWith({
        include: [
          {
            model: Profession,
            through: { attributes: [] },
            attributes: [],
          },
        ],
        attributes: ["id", "photoUrl", "nameRu", "nameEn"],
        limit: 20,
        offset: 0,
        order: [["nameRu", "ASC"]],
      });
      expect(result).toEqual({
        items: mockPersonArray,
        total: mockPersonArray.length,
        hasMore: false,
      });
    });
  });

  describe("getPersonProfile", () => {
    it("should return a person profile without films", async () => {
      const result = await service.getPersonProfile(1);
      expect(mockPersonsRepository.findByPk).toHaveBeenCalledWith(1, {
        attributes: ['id', 'photoUrl', 'nameRu', 'nameEn'],
        include: [
          {
            model: Profession,
            attributes: ["id", "name"],
            through: { attributes: [] },
          },
        ],
      });
      expect(mockPersonInstance.$get).not.toHaveBeenCalled();
      expect(result).toEqual(mockPersonArray[0]);
    });
  });

  describe("getPersonFilmography", () => {
    it("should return filmography page", async () => {
      const result = await service.getPersonFilmography({
        id: 1,
        limit: 10,
        offset: 0,
      });
      expect(mockPersonsRepository.findByPk).toHaveBeenCalledWith(1, {
        attributes: ['id'],
      });
      expect(mockPersonInstance.$count).toHaveBeenCalledWith("films");
      expect(mockPersonInstance.$get).toHaveBeenCalledWith("films", expect.objectContaining({
        limit: 10,
        offset: 0,
      }));
      expect(result).toEqual({
        items: mockFilms,
        total: mockFilms.length,
        page: 1,
        perPage: 10,
        hasMore: false,
      });
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
            through: { attributes: [] },
            attributes: [],
            where: { id: professionId },
            required: true,
          },
        ],
        attributes: ["id", "photoUrl", "nameRu", "nameEn"],
        where: {
          [Op.or]: [
            {
              nameRu: {
                [Op.iLike]: `%${personName}%`,
              },
            },
            {
              nameEn: {
                [Op.iLike]: `%${personName}%`,
              },
            },
          ],
        },
        limit: 20,
      });
    });
  });
});
