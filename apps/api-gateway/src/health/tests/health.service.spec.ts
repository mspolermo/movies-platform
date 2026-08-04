import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AuthService } from "../../auth";
import { FilmsService } from "../../films";
import { HealthService } from "../health.service";

describe("HealthService", () => {
  let service: HealthService;
  let authService: { ping: jest.Mock };
  let filmsService: { ping: jest.Mock };

  beforeEach(async () => {
    authService = { ping: jest.fn() };
    filmsService = { ping: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: AuthService, useValue: authService },
        { provide: FilmsService, useValue: filmsService },
      ],
    }).compile();

    service = module.get(HealthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  describe("live", () => {
    it("returns ok without calling dependencies", () => {
      const result = service.live();

      expect(result).toMatchObject({
        status: "ok",
        service: "api-gateway",
      });
      expect(result.timestamp).toEqual(expect.any(String));
      expect(authService.ping).not.toHaveBeenCalled();
      expect(filmsService.ping).not.toHaveBeenCalled();
    });
  });

  describe("ready", () => {
    it("returns 200 when both dependencies are connected", async () => {
      authService.ping.mockResolvedValue(true);
      filmsService.ping.mockResolvedValue(true);

      const { body, httpStatus } = await service.ready();

      expect(httpStatus).toBe(HttpStatus.OK);
      expect(body).toMatchObject({
        status: "ok",
        service: "api-gateway",
        dependencies: {
          users: "connected",
          films: "connected",
        },
      });
    });

    it("returns 503 when users ping fails", async () => {
      authService.ping.mockRejectedValue(new Error("down"));
      filmsService.ping.mockResolvedValue(true);

      const { body, httpStatus } = await service.ready();

      expect(httpStatus).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(body).toMatchObject({
        status: "error",
        dependencies: {
          users: "disconnected",
          films: "connected",
        },
      });
    });

    it("returns 503 when films ping times out", async () => {
      jest.useFakeTimers();
      authService.ping.mockResolvedValue(true);
      filmsService.ping.mockImplementation(
        () => new Promise(() => undefined)
      );

      const readyPromise = service.ready();
      await jest.advanceTimersByTimeAsync(3000);
      const { body, httpStatus } = await readyPromise;

      expect(httpStatus).toBe(HttpStatus.SERVICE_UNAVAILABLE);
      expect(body.dependencies).toEqual({
        users: "connected",
        films: "disconnected",
      });
    });
  });
});
