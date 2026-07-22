import { Test, TestingModule } from "@nestjs/testing";

import {
  FilmCastService,
  FilmCatalogService,
  FilmDetailsService,
  FilmSimilarService,
  FilmsService,
} from "../services";

describe("FilmsService (facade)", () => {
  let service: FilmsService;

  const mockDetails = {
    getFilmById: jest.fn(),
  };
  const mockCatalog = {
    searchFilmsByName: jest.fn(),
    filmFilters: jest.fn(),
    getAllFilmYears: jest.fn(),
  };
  const mockSimilar = {
    getSimilarFilms: jest.fn(),
  };
  const mockCast = {
    getFilmProfessions: jest.fn(),
    getFilmPersonsByProfession: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        { provide: FilmDetailsService, useValue: mockDetails },
        { provide: FilmCatalogService, useValue: mockCatalog },
        { provide: FilmSimilarService, useValue: mockSimilar },
        { provide: FilmCastService, useValue: mockCast },
      ],
    }).compile();

    service = module.get<FilmsService>(FilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("delegates getFilmById to FilmDetailsService", async () => {
    mockDetails.getFilmById.mockResolvedValue({ id: 1 });

    const result = await service.getFilmById(1);

    expect(mockDetails.getFilmById).toHaveBeenCalledWith(1);
    expect(result).toEqual({ id: 1 });
  });

  it("delegates getSimilarFilms to FilmSimilarService", async () => {
    const request = { filmId: 1, limit: 10 };
    mockSimilar.getSimilarFilms.mockResolvedValue([]);

    const result = await service.getSimilarFilms(request);

    expect(mockSimilar.getSimilarFilms).toHaveBeenCalledWith(request);
    expect(result).toEqual([]);
  });

  it("delegates searchFilmsByName to FilmCatalogService", async () => {
    mockCatalog.searchFilmsByName.mockResolvedValue([]);

    const result = await service.searchFilmsByName("Matrix");

    expect(mockCatalog.searchFilmsByName).toHaveBeenCalledWith("Matrix");
    expect(result).toEqual([]);
  });

  it("delegates filmFilters to FilmCatalogService", async () => {
    const dto = { page: 1, perPage: 20 };
    mockCatalog.filmFilters.mockResolvedValue({ items: [] });

    const result = await service.filmFilters(dto as never);

    expect(mockCatalog.filmFilters).toHaveBeenCalledWith(dto);
    expect(result).toEqual({ items: [] });
  });

  it("delegates getAllFilmYears to FilmCatalogService", async () => {
    mockCatalog.getAllFilmYears.mockResolvedValue([2020]);

    const result = await service.getAllFilmYears();

    expect(mockCatalog.getAllFilmYears).toHaveBeenCalled();
    expect(result).toEqual([2020]);
  });

  it("delegates getFilmProfessions to FilmCastService", async () => {
    mockCast.getFilmProfessions.mockResolvedValue([{ id: 1, name: "Актёр" }]);

    const result = await service.getFilmProfessions(5);

    expect(mockCast.getFilmProfessions).toHaveBeenCalledWith(5);
    expect(result).toEqual([{ id: 1, name: "Актёр" }]);
  });

  it("delegates getFilmPersonsByProfession to FilmCastService", async () => {
    mockCast.getFilmPersonsByProfession.mockResolvedValue({ items: [] });

    const result = await service.getFilmPersonsByProfession(5, "Актёр", 2, 10);

    expect(mockCast.getFilmPersonsByProfession).toHaveBeenCalledWith(
      5,
      "Актёр",
      2,
      10
    );
    expect(result).toEqual({ items: [] });
  });
});
