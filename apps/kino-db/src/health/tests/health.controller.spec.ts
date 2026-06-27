import { ServiceUnavailableException } from "@nestjs/common";
import { getConnectionToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { HealthController } from "../controllers";

describe("HealthController", () => {
  let controller: HealthController;

  const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(undefined),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("ping", () => {
    it("should return true", () => {
      expect(controller.ping()).toBe(true);
    });
  });

  describe("health", () => {
    it("should return ok when database is connected", async () => {
      const result = await controller.health();

      expect(mockSequelize.authenticate).toHaveBeenCalled();
      expect(result).toMatchObject({
        status: "ok",
        service: "kino-db",
        database: "connected",
      });
      expect(result.timestamp).toBeDefined();
    });

    it("should throw ServiceUnavailableException when database is down", async () => {
      mockSequelize.authenticate.mockRejectedValueOnce(
        new Error("connection refused")
      );

      await expect(controller.health()).rejects.toThrow(
        ServiceUnavailableException
      );
    });
  });
});
