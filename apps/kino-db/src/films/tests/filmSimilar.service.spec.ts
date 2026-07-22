import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Op } from "sequelize";

import { LIST_MAX_LIMIT } from "@common/constants";

import { Film, FilmGenre } from "../models";
import { FilmSimilarService } from "../services";

describe("FilmSimilarService", () => {
  let service: FilmSimilarService;

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
    toJSON: function () {
      return {
        id: this.id,
        filmNameRu: this.filmNameRu,
        filmNameEn: this.filmNameEn,
        bigPictureUrl: this.bigPictureUrl,
        smallPictureUrl: this.smallPictureUrl,
        ratingKp: this.ratingKp,
        year: this.year,
        premiereCountry: this.premiereCountry,
        movieLength: this.movieLength,
      };
    },
  };

  const mockFilmsRepository = {
    findAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockFilmGenreRepository = {
    findAll: jest.fn().mockResolvedValue([]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmSimilarService,
        {
          provide: getModelToken(Film),
          useValue: mockFilmsRepository,
        },
        {
          provide: getModelToken(FilmGenre),
          useValue: mockFilmGenreRepository,
        },
      ],
    }).compile();

    service = module.get<FilmSimilarService>(FilmSimilarService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getSimilarFilms", () => {
    it("should return null when film is not found", async () => {
      jest.spyOn(mockFilmsRepository, "findByPk").mockResolvedValue(null);

      const result = await service.getSimilarFilms({ filmId: 999 });

      expect(result).toBeNull();
      expect(mockFilmGenreRepository.findAll).not.toHaveBeenCalled();
    });

    it("should return empty array when film has no genres", async () => {
      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue({ id: 1 });
      jest.spyOn(mockFilmGenreRepository, "findAll").mockResolvedValue([]);

      const result = await service.getSimilarFilms({ filmId: 1 });

      expect(result).toEqual([]);
    });

    it("should rank films by shared genre count and map cards", async () => {
      const similarFilm = {
        ...mockFilm,
        id: 2,
        ratingKp: 8,
        toJSON: function () {
          return {
            id: this.id,
            filmNameRu: this.filmNameRu,
            filmNameEn: this.filmNameEn,
            bigPictureUrl: this.bigPictureUrl,
            smallPictureUrl: this.smallPictureUrl,
            ratingKp: this.ratingKp,
            year: this.year,
            premiereCountry: this.premiereCountry,
            movieLength: this.movieLength,
          };
        },
      };

      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue({ id: 1 });
      jest
        .spyOn(mockFilmGenreRepository, "findAll")
        .mockResolvedValueOnce([{ genreId: 10 }])
        .mockResolvedValueOnce([{ filmId: 2, sharedCount: "2" }]);
      jest
        .spyOn(mockFilmsRepository, "findAll")
        .mockResolvedValue([similarFilm]);

      const result = await service.getSimilarFilms({ filmId: 1, limit: 20 });

      expect(result).toEqual([
        {
          id: 2,
          filmNameRu: "string",
          filmNameEn: "string",
          bigPictureUrl: "string",
          smallPictureUrl: "string",
          ratingKp: 8,
          year: 1,
          premiereCountry: "string",
          movieLength: 1,
        },
      ]);
    });

    it("should order by sharedCount then ratingKp before applying limit", async () => {
      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue({ id: 1 });
      jest
        .spyOn(mockFilmGenreRepository, "findAll")
        .mockResolvedValueOnce([{ genreId: 10 }])
        .mockResolvedValueOnce([
          { filmId: 3, sharedCount: "2" },
          { filmId: 2, sharedCount: "2" },
        ]);
      jest.spyOn(mockFilmsRepository, "findAll").mockResolvedValue([
        { ...mockFilm, id: 2, ratingKp: 9 },
        { ...mockFilm, id: 3, ratingKp: 7 },
      ]);

      await service.getSimilarFilms({ filmId: 1, limit: 20 });

      const rankedCall = mockFilmGenreRepository.findAll.mock.calls[1][0];

      expect(rankedCall.limit).toBe(20);
      expect(rankedCall.group).toEqual(["FilmGenre.A"]);
      expect(rankedCall.where).toEqual({
        genreId: { [Op.in]: [10] },
        filmId: { [Op.ne]: 1 },
      });
      expect(rankedCall.include).toEqual([
        expect.objectContaining({
          model: Film,
          as: "Film",
          required: true,
        }),
      ]);
      expect(rankedCall.order[0][0]).toEqual(
        expect.objectContaining({ fn: "COUNT" })
      );
      expect(rankedCall.order[1][0]).toEqual(
        expect.objectContaining({ fn: "MAX" })
      );
      expect(rankedCall.order[1][1]).toBe("DESC");
    });

    it("should preserve SQL rank order when mapping cards", async () => {
      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue({ id: 1 });
      jest
        .spyOn(mockFilmGenreRepository, "findAll")
        .mockResolvedValueOnce([{ genreId: 10 }])
        .mockResolvedValueOnce([
          { filmId: 3, sharedCount: "2" },
          { filmId: 2, sharedCount: "2" },
        ]);
      jest.spyOn(mockFilmsRepository, "findAll").mockResolvedValue([
        {
          ...mockFilm,
          id: 2,
          ratingKp: 9,
          toJSON: () => ({
            id: 2,
            filmNameRu: "string",
            filmNameEn: "string",
            bigPictureUrl: "string",
            smallPictureUrl: "string",
            ratingKp: 9,
            year: 1,
            premiereCountry: "string",
            movieLength: 1,
          }),
        },
        {
          ...mockFilm,
          id: 3,
          ratingKp: 7,
          toJSON: () => ({
            id: 3,
            filmNameRu: "string",
            filmNameEn: "string",
            bigPictureUrl: "string",
            smallPictureUrl: "string",
            ratingKp: 7,
            year: 1,
            premiereCountry: "string",
            movieLength: 1,
          }),
        },
      ]);

      const result = await service.getSimilarFilms({ filmId: 1, limit: 20 });

      expect(result).not.toBeNull();
      expect(result!.map((film) => film.id)).toEqual([3, 2]);
    });

    it("should cap limit to LIST_MAX_LIMIT and raise floor to 1", async () => {
      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue({ id: 1 });
      jest
        .spyOn(mockFilmGenreRepository, "findAll")
        .mockResolvedValueOnce([{ genreId: 10 }])
        .mockResolvedValueOnce([]);

      await service.getSimilarFilms({
        filmId: 1,
        limit: LIST_MAX_LIMIT + 50,
      });

      expect(mockFilmGenreRepository.findAll.mock.calls[1][0].limit).toBe(
        LIST_MAX_LIMIT
      );

      jest.clearAllMocks();
      jest
        .spyOn(mockFilmsRepository, "findByPk")
        .mockResolvedValue({ id: 1 });
      jest
        .spyOn(mockFilmGenreRepository, "findAll")
        .mockResolvedValueOnce([{ genreId: 10 }])
        .mockResolvedValueOnce([]);

      await service.getSimilarFilms({ filmId: 1, limit: 0 });

      expect(mockFilmGenreRepository.findAll.mock.calls[1][0].limit).toBe(1);
    });
  });
});
