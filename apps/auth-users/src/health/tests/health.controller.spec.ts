import { ServiceUnavailableException } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { getConnectionToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { HealthController } from "../controllers";

describe("HealthController", () => {
  let controller: HealthController;

  const mockSequelize = {
    authenticate: jest.fn(),
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

    controller = module.get(HealthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("ping", () => {
    it("should return true when database is connected", async () => {
      mockSequelize.authenticate.mockResolvedValue(undefined);

      await expect(controller.ping()).resolves.toBe(true);
      expect(mockSequelize.authenticate).toHaveBeenCalledTimes(1);
    });

    it("should throw RpcException when database is down", async () => {
      mockSequelize.authenticate.mockRejectedValueOnce(
        new Error("connection refused")
      );

      await expect(controller.ping()).rejects.toBeInstanceOf(RpcException);
    });
  });

  describe("health", () => {
    it("should return ok when database is connected", async () => {
      mockSequelize.authenticate.mockResolvedValue(undefined);

      const result = await controller.health();

      expect(mockSequelize.authenticate).toHaveBeenCalledTimes(1);

      expect(result).toMatchObject({
        status: "ok",
        service: "auth-users",
        database: "connected",
      });

      expect(result.timestamp).toEqual(expect.any(String));
    });

    it("should throw ServiceUnavailableException when database is down", async () => {
      mockSequelize.authenticate.mockRejectedValue(
        new Error("connection refused")
      );

      await expect(controller.health()).rejects.toBeInstanceOf(
        ServiceUnavailableException
      );

      await expect(controller.health()).rejects.toMatchObject({
        response: {
          status: "error",
          service: "auth-users",
          database: "disconnected",
        },
      });
    });
  });
});
