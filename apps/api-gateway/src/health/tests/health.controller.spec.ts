import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { HealthController } from "../health.controller";
import { HealthService } from "../health.service";

describe("HealthController", () => {
  let controller: HealthController;
  let healthService: {
    live: jest.Mock;
    ready: jest.Mock;
  };

  beforeEach(async () => {
    healthService = {
      live: jest.fn(),
      ready: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthService }],
    }).compile();

    controller = module.get(HealthController);
  });

  it("live delegates to HealthService", () => {
    const body = {
      status: "ok" as const,
      timestamp: "t",
      service: "api-gateway" as const,
    };
    healthService.live.mockReturnValue(body);

    expect(controller.live()).toEqual(body);
  });

  it("ready sets 503 on error without throwing", async () => {
    const body = {
      status: "error" as const,
      timestamp: "t",
      service: "api-gateway" as const,
      dependencies: {
        users: "disconnected" as const,
        films: "connected" as const,
      },
    };
    healthService.ready.mockResolvedValue({
      body,
      httpStatus: HttpStatus.SERVICE_UNAVAILABLE,
    });

    const res = { status: jest.fn() };
    const result = await controller.ready(res as never);

    expect(res.status).toHaveBeenCalledWith(HttpStatus.SERVICE_UNAVAILABLE);
    expect(result).toEqual(body);
  });

  it("ready does not set status on ok", async () => {
    const body = {
      status: "ok" as const,
      timestamp: "t",
      service: "api-gateway" as const,
      dependencies: {
        users: "connected" as const,
        films: "connected" as const,
      },
    };
    healthService.ready.mockResolvedValue({
      body,
      httpStatus: HttpStatus.OK,
    });

    const res = { status: jest.fn() };
    const result = await controller.ready(res as never);

    expect(res.status).not.toHaveBeenCalled();
    expect(result).toEqual(body);
  });
});
