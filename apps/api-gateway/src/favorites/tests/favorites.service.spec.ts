import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { FilmsService } from "../../films/services";
import { FavoritesClient } from "../clients";
import { FavoritesService } from "../services";

describe("FavoritesService (api-gateway)", () => {
  let service: FavoritesService;

  const mockFavoritesClient = {
    toggle: jest.fn(),
    remove: jest.fn(),
    list: jest.fn(),
    ids: jest.fn(),
  };

  const mockFilmsService = {
    getFilmById: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FavoritesService,
        { provide: FavoritesClient, useValue: mockFavoritesClient },
        { provide: FilmsService, useValue: mockFilmsService },
      ],
    }).compile();

    service = module.get(FavoritesService);
  });

  describe("toggle", () => {
    it("при существующем фильме вызывает favorites.toggle", async () => {
      mockFilmsService.getFilmById.mockResolvedValue({ id: 10 });
      mockFavoritesClient.toggle.mockResolvedValue({ isFavorite: true });

      await expect(service.toggle(1, 10)).resolves.toEqual({
        isFavorite: true,
      });

      expect(mockFavoritesClient.toggle).toHaveBeenCalledWith(1, 10);
      expect(mockFavoritesClient.remove).not.toHaveBeenCalled();
    });

    it("при 404 фильма вызывает favorites.remove (orphan cleanup)", async () => {
      mockFilmsService.getFilmById.mockRejectedValue(
        new NotFoundException("Film with id 10 not found")
      );
      mockFavoritesClient.remove.mockResolvedValue({ isFavorite: false });

      await expect(service.toggle(1, 10)).resolves.toEqual({
        isFavorite: false,
      });

      expect(mockFavoritesClient.remove).toHaveBeenCalledWith(1, 10);
      expect(mockFavoritesClient.toggle).not.toHaveBeenCalled();
    });

    it("пробрасывает не-404 ошибки getFilmById", async () => {
      mockFilmsService.getFilmById.mockRejectedValue(new Error("rmq down"));

      await expect(service.toggle(1, 10)).rejects.toThrow("rmq down");
      expect(mockFavoritesClient.toggle).not.toHaveBeenCalled();
      expect(mockFavoritesClient.remove).not.toHaveBeenCalled();
    });
  });
});
