import { RpcException } from "@nestjs/microservices";
import { getConnectionToken, getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { UniqueConstraintError } from "sequelize";

import { UserFilmRating } from "../models";
import { RatingsService } from "../services";

describe("RatingsService", () => {
  let service: RatingsService;

  const mockTransaction = {};
  const mockSequelize = {
    transaction: jest.fn((cb: (t: unknown) => Promise<unknown>) =>
      cb(mockTransaction)
    ),
    query: jest.fn().mockResolvedValue([]),
  };

  const mockRatingRepository = {
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
        RatingsService,
        {
          provide: getModelToken(UserFilmRating),
          useValue: mockRatingRepository,
        },
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get(RatingsService);
  });

  describe("upsert", () => {
    it("создаёт новую оценку", async () => {
      const updatedAt = new Date("2024-01-01T00:00:00.000Z");
      mockRatingRepository.findOne.mockResolvedValue(null);
      mockRatingRepository.create.mockResolvedValue({
        filmId: 10,
        grade: 8,
        updatedAt,
      });

      await expect(
        service.upsert({ userId: 1, filmId: 10, grade: 8 })
      ).resolves.toEqual({
        filmId: 10,
        grade: 8,
        updatedAt: updatedAt.toISOString(),
      });

      expect(mockSequelize.query).toHaveBeenCalledWith(
        "SELECT pg_advisory_xact_lock(:userId, :filmId)",
        expect.objectContaining({
          replacements: { userId: 1, filmId: 10 },
          transaction: mockTransaction,
        })
      );
      expect(mockRatingRepository.create).toHaveBeenCalledWith(
        { userId: 1, filmId: 10, grade: 8 },
        { transaction: mockTransaction }
      );
    });

    it("обновляет существующую оценку", async () => {
      const updatedAt = new Date("2024-01-02T00:00:00.000Z");
      const existing = {
        filmId: 10,
        grade: 5,
        updatedAt,
        update: jest.fn(async function update(
          this: { grade: number },
          data: { grade: number }
        ) {
          this.grade = data.grade;
        }),
        reload: jest.fn(async function reload(this: {
          grade: number;
          updatedAt: Date;
        }) {
          this.updatedAt = new Date("2024-01-03T00:00:00.000Z");
        }),
      };
      mockRatingRepository.findOne.mockResolvedValue(existing);

      const result = await service.upsert({
        userId: 1,
        filmId: 10,
        grade: 9,
      });

      expect(existing.update).toHaveBeenCalledWith(
        { grade: 9 },
        { transaction: mockTransaction }
      );
      expect(existing.reload).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
      expect(result.grade).toBe(9);
      expect(result.updatedAt).toBe("2024-01-03T00:00:00.000Z");
    });

    it("отклоняет grade вне диапазона", async () => {
      await expect(
        service.upsert({ userId: 1, filmId: 10, grade: 0 })
      ).rejects.toBeInstanceOf(RpcException);
    });

    it("отклоняет некорректный filmId", async () => {
      await expect(
        service.upsert({ userId: 1, filmId: 0, grade: 5 })
      ).rejects.toBeInstanceOf(RpcException);
    });

    it("при unique race на create обновляет concurrent запись", async () => {
      const updatedAt = new Date("2024-01-03T00:00:00.000Z");
      const concurrent = {
        filmId: 10,
        grade: 4,
        updatedAt,
        update: jest.fn(async function update(
          this: { grade: number },
          data: { grade: number }
        ) {
          this.grade = data.grade;
        }),
        reload: jest.fn(async function reload(this: {
          grade: number;
          updatedAt: Date;
        }) {
          this.updatedAt = new Date("2024-01-04T00:00:00.000Z");
        }),
      };

      mockRatingRepository.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(concurrent);
      mockRatingRepository.create.mockRejectedValue(
        new UniqueConstraintError({})
      );

      const result = await service.upsert({
        userId: 1,
        filmId: 10,
        grade: 9,
      });

      expect(concurrent.update).toHaveBeenCalledWith(
        { grade: 9 },
        { transaction: mockTransaction }
      );
      expect(concurrent.reload).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
      expect(result.grade).toBe(9);
      expect(result.updatedAt).toBe("2024-01-04T00:00:00.000Z");
    });
  });

  describe("delete", () => {
    it("deleted=true при удалении", async () => {
      mockRatingRepository.destroy.mockResolvedValue(1);
      await expect(
        service.delete({ userId: 1, filmId: 10 })
      ).resolves.toEqual({ deleted: true });

      expect(mockSequelize.query).toHaveBeenCalledWith(
        "SELECT pg_advisory_xact_lock(:userId, :filmId)",
        expect.objectContaining({
          replacements: { userId: 1, filmId: 10 },
          transaction: mockTransaction,
        })
      );
      expect(mockRatingRepository.destroy).toHaveBeenCalledWith({
        where: { userId: 1, filmId: 10 },
        transaction: mockTransaction,
      });
    });

    it("deleted=false если записи не было", async () => {
      mockRatingRepository.destroy.mockResolvedValue(0);
      await expect(
        service.delete({ userId: 1, filmId: 10 })
      ).resolves.toEqual({ deleted: false });
    });
  });

  describe("list", () => {
    it("возвращает meta.hasMore", async () => {
      const updatedAt = new Date("2024-01-01T00:00:00.000Z");
      mockRatingRepository.findAndCountAll.mockResolvedValue({
        rows: [{ filmId: 10, grade: 7, updatedAt }],
        count: 2,
      });

      const result = await service.list({ userId: 1, page: 1, perPage: 1 });

      expect(result.hasMore).toBe(true);
      expect(result.items[0]).toEqual({
        filmId: 10,
        grade: 7,
        updatedAt: updatedAt.toISOString(),
      });
    });
  });

  describe("grades", () => {
    it("возвращает compact items", async () => {
      mockRatingRepository.findAll.mockResolvedValue([
        { filmId: 1, grade: 8 },
        { filmId: 2, grade: 3 },
      ]);

      await expect(service.grades({ userId: 1 })).resolves.toEqual({
        items: [
          { filmId: 1, grade: 8 },
          { filmId: 2, grade: 3 },
        ],
      });
    });
  });
});
