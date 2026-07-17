import { Test, TestingModule } from "@nestjs/testing";

import { JwtAuthGuard } from "../../shared";
import { FilmsController } from "../controllers";
import { FilmsService } from "../services";

describe("FilmsController (api-gateway)", () => {
  let controller: FilmsController;

  const mockFilmsService = {
    getSimilarFilms: jest.fn(),
    getFilmById: jest.fn(),
    searchFilms: jest.fn(),
    getFilmProfessions: jest.fn(),
    getFilmPersonsByProfession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: mockFilmsService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<FilmsController>(FilmsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getSimilarFilms", () => {
    it("should pass filmId and limit to service", async () => {
      const similar = [{ id: 2, filmNameRu: "Similar" }];
      mockFilmsService.getSimilarFilms.mockResolvedValue(similar);

      const result = await controller.getSimilarFilms(1, { limit: 10 });

      expect(mockFilmsService.getSimilarFilms).toHaveBeenCalledWith({
        filmId: 1,
        limit: 10,
      });
      expect(result).toEqual(similar);
    });
  });
});
