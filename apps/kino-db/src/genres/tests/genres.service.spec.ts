import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { Genre } from "../models/genres.model";
import { GenresService } from "../services";

describe("GenresService", () => {
  let service: GenresService;

  const mockGenre = [{ nameRu: "драма", nameEn: "drama" }];

  const mockGenresRepository = {
    findAll: jest.fn().mockResolvedValue(mockGenre),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        {
          provide: getModelToken(Genre),
          useValue: mockGenresRepository,
        },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllGenres", () => {
    it("should return an array of genres", async () => {
      mockGenresRepository.findAll.mockResolvedValue(mockGenre);

      expect(await service.getAllGenres()).toEqual(mockGenre);
      expect(mockGenresRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
