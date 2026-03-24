import { Test, TestingModule } from "@nestjs/testing";
import { GenresController } from "../genres.controller";
import { GenresService } from "../genres.service";

describe("GenresController", () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenre = [{ nameRu: "драма", nameEn: "drama" }];

  const mockGenresService = {
    getAllGenres: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [
        {
          provide: GenresService,
          useValue: mockGenresService,
        },
      ],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAll", () => {
    it("should return an array of genres", async () => {
      mockGenresService.getAllGenres.mockResolvedValue(mockGenre);

      expect(await controller.getAllGenres()).toEqual(mockGenre);
      expect(service.getAllGenres).toHaveBeenCalledTimes(1);
    });
  });
});
