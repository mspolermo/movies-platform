import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { Person } from "../../persons";
import { Profession } from "../../professions/models/professions.model";
import { Film } from "../models";
import { FilmCastService } from "../services";

describe("FilmCastService", () => {
  let service: FilmCastService;

  const mockPerson = {
    id: 10,
    photoUrl: "photo.jpg",
    nameRu: "Иван",
    nameEn: "Ivan",
    toJSON: () => ({
      id: 10,
      photoUrl: "photo.jpg",
      nameRu: "Иван",
      nameEn: "Ivan",
    }),
  };

  const mockFilmsRepository = {
    findByPk: jest.fn(),
  };

  const mockPersonsRepository = {
    findAndCountAll: jest
      .fn()
      .mockResolvedValue({ rows: [mockPerson], count: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmCastService,
        {
          provide: getModelToken(Film),
          useValue: mockFilmsRepository,
        },
        {
          provide: getModelToken(Person),
          useValue: mockPersonsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmCastService>(FilmCastService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getFilmProfessions", () => {
    it("should return empty array when film is not found", async () => {
      jest.spyOn(mockFilmsRepository, "findByPk").mockResolvedValue(null);

      const result = await service.getFilmProfessions(999);

      expect(result).toEqual([]);
    });

    it("should return unique professions from film persons", async () => {
      jest.spyOn(mockFilmsRepository, "findByPk").mockResolvedValue({
        id: 1,
        persons: [
          {
            id: 10,
            professions: [
              { id: 1, name: "Актёр" },
              { id: 2, name: "Режиссёр" },
            ],
          },
          {
            id: 11,
            professions: [
              { id: 1, name: "Актёр" },
              { id: 3, name: "Сценарист" },
            ],
          },
        ],
      });

      const result = await service.getFilmProfessions(1);

      expect(mockFilmsRepository.findByPk).toHaveBeenCalledWith(1, {
        include: [
          {
            model: Person,
            as: "persons",
            attributes: ["id"],
            through: { attributes: [] },
            include: [
              {
                model: Profession,
                as: "professions",
                attributes: ["id", "name"],
                through: { attributes: [] },
              },
            ],
          },
        ],
      });
      expect(result).toEqual([
        { id: 1, name: "Актёр" },
        { id: 2, name: "Режиссёр" },
        { id: 3, name: "Сценарист" },
      ]);
    });
  });

  describe("getFilmPersonsByProfession", () => {
    it("should return null when film is not found", async () => {
      jest.spyOn(mockFilmsRepository, "findByPk").mockResolvedValue(null);

      const result = await service.getFilmPersonsByProfession(999, "Актёр");

      expect(result).toBeNull();
      expect(mockPersonsRepository.findAndCountAll).not.toHaveBeenCalled();
    });

    it("should query persons with film and profession filters and map response", async () => {
      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue({ id: 1 });

      const result = await service.getFilmPersonsByProfession(
        1,
        "Актёр",
        1,
        20
      );

      expect(mockFilmsRepository.findByPk).toHaveBeenCalledWith(1, {
        attributes: ["id"],
      });
      expect(mockPersonsRepository.findAndCountAll).toHaveBeenCalledWith({
        attributes: ["id", "photoUrl", "nameRu", "nameEn"],
        include: [
          {
            model: Film,
            as: "films",
            attributes: [],
            through: { attributes: [] },
            where: { id: 1 },
            required: true,
          },
          {
            model: Profession,
            as: "professions",
            attributes: [],
            through: { attributes: [] },
            where: { name: "Актёр" },
            required: true,
          },
        ],
        limit: 20,
        offset: 0,
        order: [["nameRu", "ASC"]],
        distinct: true,
        col: "id",
      });
      expect(result).toEqual({
        items: [
          {
            id: 10,
            photoUrl: "photo.jpg",
            nameRu: "Иван",
            nameEn: "Ivan",
          },
        ],
        total: 1,
        page: 1,
        perPage: 20,
        hasMore: false,
      });
    });
  });
});
