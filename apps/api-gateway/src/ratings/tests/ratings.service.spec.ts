import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { FilmsService } from "../../films/services";
import { RatingsClient } from "../clients";
import { RatingsService } from "../services";

describe("RatingsService (api-gateway)", () => {
  let service: RatingsService;

  const mockRatingsClient = {
    upsert: jest.fn(),
    delete: jest.fn(),
    list: jest.fn(),
    grades: jest.fn(),
  };

  const mockFilmsService = {
    getFilmById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingsService,
        { provide: RatingsClient, useValue: mockRatingsClient },
        { provide: FilmsService, useValue: mockFilmsService },
      ],
    }).compile();

    service = module.get(RatingsService);
  });

  describe("upsert", () => {
    it("при существующем фильме вызывает ratings.upsert", async () => {
      mockFilmsService.getFilmById.mockResolvedValue({ id: 10 });
      mockRatingsClient.upsert.mockResolvedValue({
        filmId: 10,
        grade: 8,
        updatedAt: "2024-01-01T00:00:00.000Z",
      });

      await expect(service.upsert(1, 10, 8)).resolves.toEqual({
        filmId: 10,
        grade: 8,
        updatedAt: "2024-01-01T00:00:00.000Z",
      });

      expect(mockRatingsClient.upsert).toHaveBeenCalledWith(1, 10, 8);
      expect(mockRatingsClient.delete).not.toHaveBeenCalled();
    });

    it("при 404 фильма делает orphan cleanup (delete) и пробрасывает 404", async () => {
      mockFilmsService.getFilmById.mockRejectedValue(
        new NotFoundException("Film with id 10 not found")
      );
      mockRatingsClient.delete.mockResolvedValue({ deleted: true });

      await expect(service.upsert(1, 10, 8)).rejects.toBeInstanceOf(
        NotFoundException
      );

      expect(mockRatingsClient.delete).toHaveBeenCalledWith(1, 10);
      expect(mockRatingsClient.upsert).not.toHaveBeenCalled();
    });

    it("при 404 фильма пробрасывает 404 даже если orphan delete упал", async () => {
      mockFilmsService.getFilmById.mockRejectedValue(
        new NotFoundException("Film with id 10 not found")
      );
      mockRatingsClient.delete.mockRejectedValue(new Error("rmq down"));

      await expect(service.upsert(1, 10, 8)).rejects.toBeInstanceOf(
        NotFoundException
      );

      expect(mockRatingsClient.delete).toHaveBeenCalledWith(1, 10);
      expect(mockRatingsClient.upsert).not.toHaveBeenCalled();
    });

    it("пробрасывает не-404 ошибки getFilmById без delete", async () => {
      mockFilmsService.getFilmById.mockRejectedValue(new Error("rmq down"));

      await expect(service.upsert(1, 10, 8)).rejects.toThrow("rmq down");
      expect(mockRatingsClient.delete).not.toHaveBeenCalled();
      expect(mockRatingsClient.upsert).not.toHaveBeenCalled();
    });
  });
});
