import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Op, Sequelize } from "sequelize";

import { Country } from "../../countries";
import { Genre } from "../../genres/models/genres.model";
import { Person } from "../../persons";
import { Film } from "../models";
import { FilmCatalogService } from "../services";

describe("FilmCatalogService", () => {
  let service: FilmCatalogService;

  const expectedFilmCard = {
    id: 1,
    filmNameRu: "string",
    filmNameEn: "string",
    bigPictureUrl: "string",
    smallPictureUrl: "string",
    ratingKp: 1,
    year: 1,
    premiereCountry: "string",
    movieLength: 1,
  };

  const mockFilm = {
    id: 1,
    filmNameRu: "string",
    filmNameEn: "string",
    bigPictureUrl: "string",
    smallPictureUrl: "string",
    ratingKp: 1,
    year: 1,
    premiereCountry: "string",
    movieLength: 1,
    toJSON: () => ({
      id: 1,
      filmNameRu: "string",
      filmNameEn: "string",
      bigPictureUrl: "string",
      smallPictureUrl: "string",
      ratingKp: 1,
      year: 1,
      premiereCountry: "string",
      movieLength: 1,
    }),
  };

  const mockFilmsRepository = {
    findAll: jest.fn().mockResolvedValue([mockFilm]),
    findAndCountAll: jest
      .fn()
      .mockResolvedValue({ rows: [mockFilm], count: 1 }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmCatalogService,
        {
          provide: getModelToken(Film),
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmCatalogService>(FilmCatalogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("searchFilmsByName", () => {
    it("should return films matching the provided name", async () => {
      const name = "Film";

      jest.spyOn(mockFilmsRepository, "findAll").mockResolvedValue([mockFilm]);

      const result = await service.searchFilmsByName(name);

      expect(mockFilmsRepository.findAll).toHaveBeenCalledWith({
        attributes: [
          "id",
          "filmNameRu",
          "filmNameEn",
          "bigPictureUrl",
          "smallPictureUrl",
          "ratingKp",
          "year",
          "premiereCountry",
          "movieLength",
        ],
        where: {
          [Op.or]: [
            { filmNameRu: { [Op.iLike]: `%${name}%` } },
            { filmNameEn: { [Op.iLike]: `%${name}%` } },
          ],
        },
        limit: 10,
        order: [["votesKp", "DESC"]],
      });
      expect(result).toEqual([expectedFilmCard]);
    });
  });

  describe("getAllFilmYears", () => {
    it("should return all distinct film years in ascending order", async () => {
      const mockYears = [{ year: 2000 }, { year: 2001 }, { year: 2002 }];

      jest.spyOn(mockFilmsRepository, "findAll").mockResolvedValue(mockYears);

      const result = await service.getAllFilmYears();

      expect(mockFilmsRepository.findAll).toHaveBeenCalledWith({
        attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("year")), "year"]],
        order: [[Sequelize.col("year"), "ASC"]],
      });
      expect(result).toEqual([2000, 2001, 2002]);
    });
  });

  describe("filmFilters", () => {
    it("should return filtered films based on provided parameters", async () => {
      const mockPage = 1;
      const mockPerPage = 10;
      const mockGenres = ["Action", "Thriller"];
      const mockCountries = ["USA", "UK"];
      const mockPersons = ["Tom Cruise", "Brad Pitt"];
      const mockMinRatingKp = 7;
      const mockMinVotesKp = 1000;
      const mockSortBy = "rating" as const;
      const mockYears = [2022];

      jest
        .spyOn(mockFilmsRepository, "findAndCountAll")
        .mockResolvedValue({ rows: [mockFilm], count: 1 });

      const result = await service.filmFilters({
        page: mockPage,
        perPage: mockPerPage,
        genres: mockGenres,
        countries: mockCountries,
        persons: mockPersons,
        minRatingKp: mockMinRatingKp,
        minVotesKp: mockMinVotesKp,
        sortBy: mockSortBy,
        years: mockYears,
      });

      expect(mockFilmsRepository.findAndCountAll).toHaveBeenCalledWith({
        attributes: [
          "id",
          "filmNameRu",
          "filmNameEn",
          "bigPictureUrl",
          "smallPictureUrl",
          "ratingKp",
          "year",
          "premiereCountry",
          "movieLength",
        ],
        include: [
          {
            model: Genre,
            as: "genres",
            attributes: [],
            through: { attributes: [] },
            required: true,
            where: {
              [Op.or]: [{ nameRu: mockGenres }, { nameEn: mockGenres }],
            },
          },
          {
            model: Country,
            as: "countries",
            attributes: [],
            through: { attributes: [] },
            required: true,
            where: {
              [Op.or]: [
                { countryName: mockCountries },
                { countryNameEn: mockCountries },
              ],
            },
          },
          {
            model: Person,
            as: "persons",
            attributes: [],
            through: { attributes: [] },
            required: true,
            where: {
              [Op.or]: [{ nameRu: mockPersons }, { nameEn: mockPersons }],
            },
          },
        ],
        where: {
          ratingKp: { [Op.gte]: mockMinRatingKp },
          votesKp: { [Op.gte]: mockMinVotesKp },
          year: mockYears[0],
        },
        limit: mockPerPage,
        offset: (mockPage - 1) * mockPerPage,
        order: [["ratingKp", "DESC"]],
        distinct: true,
        col: "id",
      });
      expect(result).toEqual({
        items: [expectedFilmCard],
        total: 1,
        page: mockPage,
        perPage: mockPerPage,
        hasMore: false,
      });
    });

    it("should include popularity sort field in attributes without leaking it to response", async () => {
      jest
        .spyOn(mockFilmsRepository, "findAndCountAll")
        .mockResolvedValue({ rows: [mockFilm], count: 1 });

      const result = await service.filmFilters({
        page: 1,
        perPage: 20,
        genres: ["Biography"],
        minRatingKp: 0,
        minVotesKp: 0,
        sortBy: "popularity",
      });

      expect(mockFilmsRepository.findAndCountAll).toHaveBeenCalledWith({
        attributes: [
          "id",
          "filmNameRu",
          "filmNameEn",
          "bigPictureUrl",
          "smallPictureUrl",
          "ratingKp",
          "year",
          "premiereCountry",
          "movieLength",
          "votesKp",
        ],
        include: [
          {
            model: Genre,
            as: "genres",
            attributes: [],
            through: { attributes: [] },
            required: true,
            where: {
              [Op.or]: [
                { nameRu: ["Biography"] },
                { nameEn: ["Biography"] },
              ],
            },
          },
        ],
        where: {
          ratingKp: { [Op.gte]: 0 },
          votesKp: { [Op.gte]: 0 },
        },
        limit: 20,
        offset: 0,
        order: [["votesKp", "DESC"]],
        distinct: true,
        col: "id",
      });
      expect(result).toEqual({
        items: [expectedFilmCard],
        total: 1,
        page: 1,
        perPage: 20,
        hasMore: false,
      });
    });
  });
});
