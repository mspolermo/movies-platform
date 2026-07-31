import { getConnectionToken, getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { UniqueConstraintError } from "sequelize";

import { UserFavorite } from "../models";
import { FavoritesService } from "../services";

describe("FavoritesService", () => {
  let service: FavoritesService;

  const mockTransaction = {};
  const mockSequelize = {
    transaction: jest.fn((cb: (t: unknown) => Promise<unknown>) =>
      cb(mockTransaction)
    ),
    query: jest.fn().mockResolvedValue([]),
  };

  const mockFavoriteRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    destroy: jest.fn(),
    findAndCountAll: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        {
          provide: getModelToken(UserFavorite),
          useValue: mockFavoriteRepository,
        },
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get(FavoritesService);
  });

  describe("toggle", () => {
    it("добавляет в избранное, если записи нет", async () => {
      mockFavoriteRepository.findOne.mockResolvedValue(null);
      mockFavoriteRepository.create.mockResolvedValue({});

      await expect(
        service.toggle({ userId: 1, filmId: 10 })
      ).resolves.toEqual({ isFavorite: true });

      expect(mockSequelize.query).toHaveBeenCalledWith(
        "SELECT pg_advisory_xact_lock(:userId, :filmId)",
        expect.objectContaining({
          replacements: { userId: 1, filmId: 10 },
          transaction: mockTransaction,
        })
      );
      expect(mockFavoriteRepository.create).toHaveBeenCalledWith(
        { userId: 1, filmId: 10 },
        { transaction: mockTransaction }
      );
    });

    it("убирает из избранного, если запись есть", async () => {
      const destroy = jest.fn().mockResolvedValue(undefined);
      mockFavoriteRepository.findOne.mockResolvedValue({ destroy });

      await expect(
        service.toggle({ userId: 1, filmId: 10 })
      ).resolves.toEqual({ isFavorite: false });

      expect(destroy).toHaveBeenCalledWith({ transaction: mockTransaction });
    });

    it("при unique race на create возвращает isFavorite=true", async () => {
      mockFavoriteRepository.findOne.mockResolvedValue(null);
      mockFavoriteRepository.create.mockRejectedValue(
        new UniqueConstraintError({})
      );

      await expect(
        service.toggle({ userId: 1, filmId: 10 })
      ).resolves.toEqual({ isFavorite: true });
    });
  });

  describe("remove", () => {
    it("idempotent remove → isFavorite=false (с advisory lock)", async () => {
      mockFavoriteRepository.destroy.mockResolvedValue(1);

      await expect(
        service.remove({ userId: 1, filmId: 10 })
      ).resolves.toEqual({ isFavorite: false });

      expect(mockSequelize.query).toHaveBeenCalledWith(
        "SELECT pg_advisory_xact_lock(:userId, :filmId)",
        expect.objectContaining({
          replacements: { userId: 1, filmId: 10 },
          transaction: mockTransaction,
        })
      );
      expect(mockFavoriteRepository.destroy).toHaveBeenCalledWith({
        where: { userId: 1, filmId: 10 },
        transaction: mockTransaction,
      });
    });
  });

  describe("list", () => {
    it("возвращает meta.hasMore", async () => {
      const createdAt = new Date("2024-01-01T00:00:00.000Z");
      mockFavoriteRepository.findAndCountAll.mockResolvedValue({
        rows: [{ filmId: 10, createdAt }],
        count: 2,
      });

      const result = await service.list({ userId: 1, page: 1, perPage: 1 });

      expect(result).toMatchObject({
        items: [{ filmId: 10, createdAt: createdAt.toISOString() }],
        total: 2,
        page: 1,
        perPage: 1,
        hasMore: true,
      });
    });
  });

  describe("ids", () => {
    it("возвращает filmIds", async () => {
      mockFavoriteRepository.findAll.mockResolvedValue([
        { filmId: 1 },
        { filmId: 2 },
      ]);

      await expect(service.ids({ userId: 1 })).resolves.toEqual({
        filmIds: [1, 2],
      });
    });
  });
});
