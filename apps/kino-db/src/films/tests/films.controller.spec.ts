import { Test, TestingModule } from "@nestjs/testing";

import { FilmsController } from "../films.controller";
import { FilmsService } from "../films.service";

describe("FilmsController", () => {
  let controller: FilmsController;
  let service: FilmsService;

  const mockFilm = {
    id: 1,
    trailerName: "string",
    trailerUrl: "string",
    ratingKp: 1,
    votesKp: 1,
    ratingImdb: 1,
    votesImdb: 1,
    ratingFilmCritics: 1,
    votesFilmCritics: 1,
    ratingRussianFilmCritics: 1,
    votesRussianFilmCritics: 1,
    movieLength: 1,
    originalFilmLanguage: "string",
    filmNameRu: "string",
    filmNameEn: "string",
    description: "string",
    premiereCountry: "string",
    slogan: "string",
    bigPictureUrl: "string",
    smallPictureUrl: "string",
    year: 1,
    top10: 1,
    top250: 1,
    premiereWorldDate: new Date("2023-05-10T16:34:56.833Z"),
    persons: [],
    countries: [],
    genres: [],
    facts: [],
    comments: [],
  };

  const mockFilmsService = {
    getFilmById: jest.fn().mockResolvedValue(mockFilm.id),
    getAllFilmYears: jest.fn(),
    searchFilmsByName: jest.fn().mockResolvedValue(mockFilm.filmNameRu),
    filmFilters: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [FilmsService],
    })
      .overrideProvider(FilmsService)
      .useValue(mockFilmsService)
      .compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getFilmById", () => {
    it("should call filmService.getFilmById with the provided id", async () => {
      const id = 1;
      const film = {
        id: mockFilm.id,
        filmNameRu: mockFilm.filmNameRu,
        genres: [],
      };
      jest.spyOn(service, "getFilmById").mockResolvedValue(film);

      const result = await controller.getFilmById(id);

      expect(service.getFilmById).toHaveBeenCalledWith(id);
      expect(result).toEqual(film);
    });
  });

  describe("getAllFilmYears", () => {
    it("should call filmService.getAllFilmYears", async () => {
      const mockYears = [2020, 2021, 2022];
      const getAllFilmYearsSpy = jest
        .spyOn(service, "getAllFilmYears")
        .mockResolvedValue(mockYears);

      const result = await controller.getAllFilmYears();

      expect(getAllFilmYearsSpy).toHaveBeenCalled();
      expect(result).toEqual(mockYears);
    });
  });

  describe("searchFilmsByName", () => {
    it("should call filmService.searchFilmsByName with the provided name", async () => {
      const name = "Film Name";

      const getFilmByNameSpy = jest
        .spyOn(service, "searchFilmsByName")
        .mockResolvedValue([mockFilm]);

      const result = await controller.searchFilmsByName(name);

      expect(getFilmByNameSpy).toHaveBeenCalledWith(name);
      expect(result).toEqual([mockFilm]);
    });
  });

  describe("filters", () => {
    it("should call filmService.filmFilters with the provided data", async () => {
      const mockData = {
        page: 1,
        perPage: 10,
        genres: ["Action", "Drama"],
        countries: ["USA", "UK"],
        persons: ["Actor 1", "Actor 2"],
        minRatingKp: 7,
        minVotesKp: 1000,
        sortBy: "rating" as const,
        year: 2021,
      };

      const filmFiltersSpy = jest.spyOn(service, "filmFilters").mockResolvedValue({
        films: [mockFilm],
        total: 1,
        page: 1,
        perPage: 10,
        hasMore: false,
      });

      const result = await controller.filters(mockData);

      expect(filmFiltersSpy).toHaveBeenCalledWith(
        mockData.page,
        mockData.perPage,
        mockData.genres,
        mockData.countries,
        mockData.persons,
        mockData.minRatingKp,
        mockData.minVotesKp,
        mockData.sortBy,
        mockData.year
      );
      expect(result).toEqual({
        films: [mockFilm],
        total: 1,
        page: 1,
        perPage: 10,
        hasMore: false,
      });
    });
  });
});
