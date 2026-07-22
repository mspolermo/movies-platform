import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { Country } from "../../countries";
import { Genre } from "../../genres/models/genres.model";
import { Fact, Film } from "../models";
import { FilmDetailsService } from "../services";

describe("FilmDetailsService", () => {
  let service: FilmDetailsService;

  const mockFilm = {
    id: 1,
    trailerUrl: "string",
    ratingKp: 1,
    votesKp: 1,
    movieLength: 1,
    filmNameRu: "string",
    filmNameEn: "string",
    description: "string",
    slogan: "string",
    bigPictureUrl: "string",
    smallPictureUrl: "string",
    year: 1,
    countries: [{ countryName: "США", countryNameEn: "USA" }],
    genres: [
      { id: 1, nameRu: "Драма", nameEn: "Drama" },
      { id: 2, nameRu: "Комедия", nameEn: "Comedy" },
    ],
    facts: [],
  };

  const mockFilmsRepository = {
    findByPk: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmDetailsService,
        {
          provide: getModelToken(Film),
          useValue: mockFilmsRepository,
        },
      ],
    }).compile();

    service = module.get<FilmDetailsService>(FilmDetailsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getFilmById", () => {
    it("should return FilmDetailsResponse", async () => {
      const filmDetailsResponse = {
        id: mockFilm.id,
        trailerUrl: mockFilm.trailerUrl,
        ratingKp: mockFilm.ratingKp,
        votesKp: mockFilm.votesKp,
        movieLength: mockFilm.movieLength,
        filmNameRu: mockFilm.filmNameRu,
        filmNameEn: mockFilm.filmNameEn,
        description: mockFilm.description,
        slogan: mockFilm.slogan,
        bigPictureUrl: mockFilm.bigPictureUrl,
        smallPictureUrl: mockFilm.smallPictureUrl,
        year: mockFilm.year,
        countries: mockFilm.countries,
        genres: mockFilm.genres.map(({ nameRu, nameEn }) => ({
          nameRu,
          nameEn,
        })),
        facts: [
          {
            type: "FACT",
            value: "fact-value",
            spoiler: false,
          },
          {
            type: "BLOOPER",
            value: "blooper-value",
            spoiler: true,
          },
        ],
      };
      const filmRow = {
        ...filmDetailsResponse,
        toJSON: () => filmDetailsResponse,
      };
      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue(filmRow as unknown as Film);

      const result = await service.getFilmById(mockFilm.id);

      expect(mockFilmsRepository.findByPk).toHaveBeenCalledWith(mockFilm.id, {
        attributes: [
          "id",
          "trailerUrl",
          "ratingKp",
          "votesKp",
          "movieLength",
          "filmNameRu",
          "filmNameEn",
          "description",
          "slogan",
          "bigPictureUrl",
          "smallPictureUrl",
          "year",
        ],
        include: [
          {
            model: Country,
            as: "countries",
            attributes: ["countryName", "countryNameEn"],
            through: { attributes: [] },
          },
          {
            model: Genre,
            as: "genres",
            attributes: ["nameRu", "nameEn"],
            through: { attributes: [] },
          },
          {
            model: Fact,
            as: "facts",
            attributes: ["type", "value", "spoiler"],
            separate: true,
            order: [["id", "ASC"]],
          },
        ],
      });
      expect(result).toEqual(filmDetailsResponse);
    });
  });
});
