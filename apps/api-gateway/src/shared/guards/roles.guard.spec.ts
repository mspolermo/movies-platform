import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Test, TestingModule } from "@nestjs/testing";

import { UserRolesService } from "../../user-roles/userRoles.service";

import { RolesGuard } from "./roles.guard";

describe("RolesGuard", () => {
  let guard: RolesGuard;

  const mockReflector = {
    getAllAndOverride: jest.fn(),
  };

  const mockUserRolesService = {
    getUserWithRoles: jest.fn(),
  };

  const createContext = (user?: {
    id: number;
    email: string;
  }): ExecutionContext =>
    ({
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({
        getRequest: () => ({ user }),
      }),
    }) as ExecutionContext;

  /** Ловит HttpException и возвращает её для ассертов. */
  const getHttpError = async (
    promise: Promise<unknown>
  ): Promise<HttpException> => {
    await expect(promise).rejects.toBeInstanceOf(HttpException);
    const error = await promise.catch((e: HttpException) => e);
    return error as HttpException;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        { provide: Reflector, useValue: mockReflector },
        { provide: UserRolesService, useValue: mockUserRolesService },
      ],
    }).compile();

    guard = module.get(RolesGuard);
  });

  it("allows request when no roles metadata", async () => {
    mockReflector.getAllAndOverride.mockReturnValue(undefined);

    await expect(guard.canActivate(createContext())).resolves.toBe(true);
    expect(mockUserRolesService.getUserWithRoles).not.toHaveBeenCalled();
  });

  it("throws 401 when user is missing on request", async () => {
    mockReflector.getAllAndOverride.mockReturnValue(["ADMIN"]);

    await expect(guard.canActivate(createContext())).rejects.toBeInstanceOf(
      UnauthorizedException
    );
  });

  it("throws 403 when user lacks required role", async () => {
    mockReflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    mockUserRolesService.getUserWithRoles.mockResolvedValue({
      id: 1,
      email: "u@x.com",
      name: null,
      roles: [{ id: 2, value: "USER" }],
    });

    const error = await getHttpError(
      guard.canActivate(createContext({ id: 1, email: "u@x.com" }))
    );

    expect(error.getStatus()).toBe(HttpStatus.FORBIDDEN);
  });

  it("allows when user has required role", async () => {
    mockReflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    const userWithRoles = {
      id: 1,
      email: "admin@x.com",
      name: "Admin",
      roles: [{ id: 1, value: "ADMIN" }],
    };
    mockUserRolesService.getUserWithRoles.mockResolvedValue(userWithRoles);

    const req = { user: { id: 1, email: "admin@x.com" } };
    const context = {
      getHandler: () => ({}),
      getClass: () => ({}),
      switchToHttp: () => ({ getRequest: () => req }),
    } as ExecutionContext;

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(req.user).toEqual(userWithRoles);
  });

  it("maps user-not-found 404 to 401", async () => {
    mockReflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    mockUserRolesService.getUserWithRoles.mockRejectedValue(
      new HttpException(
        { statusCode: 404, message: "Пользователь не найден" },
        HttpStatus.NOT_FOUND
      )
    );

    await expect(
      guard.canActivate(createContext({ id: 99, email: "gone@x.com" }))
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  it("rethrows 500 from fromRpc (B41)", async () => {
    mockReflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    mockUserRolesService.getUserWithRoles.mockRejectedValue(
      new HttpException(
        { statusCode: 500, message: "Ошибка проверки доступа" },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    );

    const error = await getHttpError(
      guard.canActivate(createContext({ id: 1, email: "u@x.com" }))
    );

    expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  it("maps unexpected Error to 500 (B41)", async () => {
    mockReflector.getAllAndOverride.mockReturnValue(["ADMIN"]);
    mockUserRolesService.getUserWithRoles.mockRejectedValue(
      new Error("rmq down")
    );

    const error = await getHttpError(
      guard.canActivate(createContext({ id: 1, email: "u@x.com" }))
    );

    expect(error.getStatus()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(error.getResponse()).toMatchObject({
      message: "Ошибка проверки доступа",
    });
  });
});
