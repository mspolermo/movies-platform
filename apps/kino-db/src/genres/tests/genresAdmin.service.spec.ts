import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { FilmGenre } from "../../films/models";
import { Genre } from "../models";
import { GenresAdminService } from "../services";

describe("GenresAdminService", () => {
  let service: GenresAdminService;

  const mockGenre = {
    id: 1,
    nameRu: "Драма",
    nameEn: "drama",
    update: jest.fn(),
    destroy: jest.fn(),
  };

  const mockGenreRepository = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
  };

  const mockFilmGenreRepository = {
    count: jest.fn(),
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
        GenresAdminService,
        { provide: getModelToken(Genre), useValue: mockGenreRepository },
        { provide: getModelToken(FilmGenre), useValue: mockFilmGenreRepository },
      ],
    }).compile();

    service = module.get<GenresAdminService>(GenresAdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listGenres", () => {
    it("returns paginated items with meta", async () => {
      mockGenreRepository.findAndCountAll.mockResolvedValue({
        rows: [mockGenre],
        count: 1,
      });

      const result = await service.listGenres({ page: 1, perPage: 10 });

      expect(mockGenreRepository.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ limit: 10, offset: 0 })
      );
      expect(result).toEqual({
        items: [{ id: 1, nameRu: "Драма", nameEn: "drama" }],
        total: 1,
        page: 1,
        perPage: 10,
        hasMore: false,
      });
    });
  });

  describe("createGenre", () => {
    it("creates genre when name is free", async () => {
      mockGenreRepository.findOne.mockResolvedValue(null);
      mockGenreRepository.create.mockResolvedValue(mockGenre);

      const result = await service.createGenre({
        nameRu: "Драма",
        nameEn: "drama",
      });

      expect(mockGenreRepository.create).toHaveBeenCalledWith({
        nameRu: "Драма",
        nameEn: "drama",
      });
      expect(result).toEqual({ id: 1, nameRu: "Драма", nameEn: "drama" });
    });

    it("throws 409 on duplicate nameRu (case-insensitive)", async () => {
      mockGenreRepository.findOne.mockResolvedValue(mockGenre);

      const error = await getRpcError(
        service.createGenre({ nameRu: "драма", nameEn: "drama" })
      );

      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(mockGenreRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("updateGenre", () => {
    it("throws 404 for unknown id", async () => {
      mockGenreRepository.findByPk.mockResolvedValue(null);

      const error = await getRpcError(
        service.updateGenre(999, { nameRu: "X" })
      );

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("throws 409 when new name is taken by another genre", async () => {
      mockGenreRepository.findByPk.mockResolvedValue(mockGenre);
      mockGenreRepository.findOne.mockResolvedValue({ id: 2, nameRu: "Драма" });

      const error = await getRpcError(
        service.updateGenre(1, { nameRu: "Драма" })
      );

      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(mockGenre.update).not.toHaveBeenCalled();
    });
  });

  describe("deleteGenre", () => {
    it("throws 409 when genre is linked to films (Restrict)", async () => {
      mockGenreRepository.findByPk.mockResolvedValue(mockGenre);
      mockFilmGenreRepository.count.mockResolvedValue(3);

      const error = await getRpcError(service.deleteGenre(1));

      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(mockGenre.destroy).not.toHaveBeenCalled();
    });

    it("deletes free genre", async () => {
      mockGenreRepository.findByPk.mockResolvedValue(mockGenre);
      mockFilmGenreRepository.count.mockResolvedValue(0);

      await expect(service.deleteGenre(1)).resolves.toBe(true);
      expect(mockGenre.destroy).toHaveBeenCalled();
    });
  });
});
