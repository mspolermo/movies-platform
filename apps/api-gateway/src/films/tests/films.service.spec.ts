import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { FilmsClient } from "../clients";
import { FilmsService } from "../services";

describe("FilmsService (api-gateway)", () => {
  let service: FilmsService;

  const mockFilmsClient = {
    getSimilarFilms: jest.fn(),
    getFilmById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: FilmsClient,
          useValue: mockFilmsClient,
        },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSimilarFilms", () => {
    it("should return similar films from client", async () => {
      const similar = [{ id: 2, filmNameRu: "Similar" }];
      mockFilmsClient.getSimilarFilms.mockResolvedValue(similar);

      const result = await service.getSimilarFilms({
        filmId: 1,
        limit: 10,
      });

      expect(mockFilmsClient.getSimilarFilms).toHaveBeenCalledWith({
        filmId: 1,
        limit: 10,
      });
      expect(result).toEqual(similar);
    });

    it("should throw NotFoundException when film is missing", async () => {
      mockFilmsClient.getSimilarFilms.mockResolvedValue(null);

      await expect(
        service.getSimilarFilms({ filmId: 999 })
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });
});
