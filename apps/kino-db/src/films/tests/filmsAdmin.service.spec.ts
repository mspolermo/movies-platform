import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";

import { CommentLike } from "../../comments/models/commentLike.model";
import { Comment } from "../../comments/models/comments.model";
import { Fact, Film, FilmCountry, FilmGenre, FilmPerson } from "../models";
import { FilmsAdminService } from "../services";

describe("FilmsAdminService", () => {
  let service: FilmsAdminService;

  const mockFilm = {
    id: 1,
    filmNameRu: "Матрица",
    filmNameEn: "The Matrix",
    description: null,
    premiereWorldDate: new Date("1999-03-31T00:00:00.000Z"),
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockFilmRepository = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };

  const mockJoinRepository = () => ({ destroy: jest.fn() });

  const mockFilmGenreRepository = mockJoinRepository();
  const mockFilmCountryRepository = mockJoinRepository();
  const mockFilmPersonRepository = mockJoinRepository();
  const mockFactRepository = mockJoinRepository();
  const mockCommentRepository = { findAll: jest.fn(), destroy: jest.fn() };
  const mockCommentLikeRepository = mockJoinRepository();

  const mockTransaction = { id: "tx" };
  const mockSequelize = {
    transaction: jest.fn(
      async (callback: (t: unknown) => Promise<void>) =>
        await callback(mockTransaction)
    ),
  };

  /** Достаёт payload RpcException для проверки statusCode. */
  const getRpcError = async (promise: Promise<unknown>) => {
    await expect(promise).rejects.toBeInstanceOf(RpcException);
    const error = await promise.catch((e: RpcException) => e);
    return (error as RpcException).getError() as {
      statusCode: number;
      message: string;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsAdminService,
        { provide: getModelToken(Film), useValue: mockFilmRepository },
        { provide: getModelToken(FilmGenre), useValue: mockFilmGenreRepository },
        {
          provide: getModelToken(FilmCountry),
          useValue: mockFilmCountryRepository,
        },
        {
          provide: getModelToken(FilmPerson),
          useValue: mockFilmPersonRepository,
        },
        { provide: getModelToken(Fact), useValue: mockFactRepository },
        { provide: getModelToken(Comment), useValue: mockCommentRepository },
        {
          provide: getModelToken(CommentLike),
          useValue: mockCommentLikeRepository,
        },
        { provide: Sequelize, useValue: mockSequelize },
      ],
    }).compile();

    service = module.get<FilmsAdminService>(FilmsAdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getFilmById", () => {
    it("maps ORM model to admin item (null → undefined, Date → ISO)", async () => {
      mockFilmRepository.findByPk.mockResolvedValue(mockFilm);

      const result = await service.getFilmById(1);

      expect(result).toMatchObject({
        id: 1,
        filmNameRu: "Матрица",
        premiereWorldDate: "1999-03-31T00:00:00.000Z",
      });
      expect(result.description).toBeUndefined();
    });

    it("throws 404 for unknown id", async () => {
      mockFilmRepository.findByPk.mockResolvedValue(null);

      const error = await getRpcError(service.getFilmById(999));

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("createFilm", () => {
    it("converts premiereWorldDate ISO string to Date", async () => {
      mockFilmRepository.create.mockResolvedValue(mockFilm);

      await service.createFilm({
        filmNameRu: "Матрица",
        premiereWorldDate: "1999-03-31T00:00:00.000Z",
      });

      expect(mockFilmRepository.create).toHaveBeenCalledWith({
        filmNameRu: "Матрица",
        premiereWorldDate: new Date("1999-03-31T00:00:00.000Z"),
      });
    });
  });

  describe("updateFilm", () => {
    it("passes null through for field clearing", async () => {
      mockFilmRepository.findByPk.mockResolvedValue(mockFilm);

      await service.updateFilm(1, { description: null, premiereWorldDate: null });

      expect(mockFilm.update).toHaveBeenCalledWith({
        description: null,
        premiereWorldDate: null,
      });
    });
  });

  describe("deleteFilm", () => {
    it("cascades in one transaction: likes → comments → joins/facts → film", async () => {
      mockFilmRepository.findByPk.mockResolvedValue(mockFilm);
      mockCommentRepository.findAll.mockResolvedValue([{ id: 10 }, { id: 11 }]);

      await expect(service.deleteFilm(1)).resolves.toBe(true);

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(mockCommentLikeRepository.destroy).toHaveBeenCalledWith({
        where: { commentId: [10, 11] },
        transaction: mockTransaction,
      });
      expect(mockCommentRepository.destroy).toHaveBeenCalledWith({
        where: { filmId: 1 },
        transaction: mockTransaction,
      });
      expect(mockFilmGenreRepository.destroy).toHaveBeenCalledWith({
        where: { filmId: 1 },
        transaction: mockTransaction,
      });
      expect(mockFilmCountryRepository.destroy).toHaveBeenCalledWith({
        where: { filmId: 1 },
        transaction: mockTransaction,
      });
      expect(mockFilmPersonRepository.destroy).toHaveBeenCalledWith({
        where: { filmId: 1 },
        transaction: mockTransaction,
      });
      expect(mockFactRepository.destroy).toHaveBeenCalledWith({
        where: { filmId: 1 },
        transaction: mockTransaction,
      });
      expect(mockFilm.destroy).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
    });

    it("skips comment cleanup when film has no comments", async () => {
      mockFilmRepository.findByPk.mockResolvedValue(mockFilm);
      mockCommentRepository.findAll.mockResolvedValue([]);

      await service.deleteFilm(1);

      expect(mockCommentLikeRepository.destroy).not.toHaveBeenCalled();
      expect(mockCommentRepository.destroy).not.toHaveBeenCalled();
      expect(mockFilm.destroy).toHaveBeenCalled();
    });
  });
});
