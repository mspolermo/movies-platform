import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";

import { Role } from "../../roles/models";
import { RolesService } from "../../roles/services";
import { User } from "../models";
import { UsersAdminService } from "../services";

describe("UsersAdminService", () => {
  let service: UsersAdminService;

  const adminRole = { id: 1, value: "ADMIN" };
  const userRole = { id: 2, value: "USER" };

  const makeUser = (id: number, roles: Array<{ id: number; value: string }>) => ({
    id,
    email: `user${id}@example.com`,
    name: null,
    roles,
    $set: jest.fn(),
  });

  const mockUserRepository = {
    findAndCountAll: jest.fn(),
    findOne: jest.fn(),
    count: jest.fn(),
  };

  const mockRoleRepository = {
    findOne: jest.fn(),
  };

  const mockRolesService = {
    getRoleByValue: jest.fn(),
  };

  const mockTransaction = {
    id: "tx",
    LOCK: { UPDATE: "UPDATE" },
  };

  const mockSequelize = {
    transaction: jest.fn(
      async (callback: (t: typeof mockTransaction) => Promise<unknown>) =>
        await callback(mockTransaction)
    ),
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
        UsersAdminService,
        { provide: getModelToken(User), useValue: mockUserRepository },
        { provide: getModelToken(Role), useValue: mockRoleRepository },
        { provide: RolesService, useValue: mockRolesService },
        { provide: Sequelize, useValue: mockSequelize },
      ],
    }).compile();

    service = module.get<UsersAdminService>(UsersAdminService);

    // Sequelize transaction.LOCK.UPDATE читается с объекта transaction
    (mockTransaction as { LOCK: { UPDATE: string } }).LOCK = {
      UPDATE: "UPDATE",
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("listUsers", () => {
    it("returns paginated items with primary role", async () => {
      mockUserRepository.findAndCountAll.mockResolvedValue({
        rows: [makeUser(1, [adminRole]), makeUser(2, [userRole])],
        count: 2,
      });

      const result = await service.listUsers({ page: 1, perPage: 50 });

      expect(mockUserRepository.findAndCountAll).toHaveBeenCalledWith(
        expect.objectContaining({ distinct: true, limit: 50, offset: 0 })
      );
      expect(result.total).toBe(2);
      expect(result.items[0]).toMatchObject({ id: 1, role: "ADMIN" });
      expect(result.items[1]).toMatchObject({ id: 2, role: "USER" });
    });
  });

  describe("setUserRole", () => {
    it("throws 404 for unknown user", async () => {
      mockRolesService.getRoleByValue.mockResolvedValue(userRole);
      mockUserRepository.findOne.mockResolvedValue(null);

      const error = await getRpcError(service.setUserRole(999, { role: "USER" }));

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("throws 400 for unknown role", async () => {
      mockRolesService.getRoleByValue.mockResolvedValue(null);

      const error = await getRpcError(
        service.setUserRole(1, { role: "MANAGER" })
      );

      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(mockSequelize.transaction).not.toHaveBeenCalled();
    });

    it("throws 409 when demoting the last ADMIN", async () => {
      const lastAdmin = makeUser(1, [adminRole]);
      mockRolesService.getRoleByValue.mockResolvedValue(userRole);
      mockUserRepository.findOne.mockResolvedValue(lastAdmin);
      mockRoleRepository.findOne.mockResolvedValue(adminRole);
      mockUserRepository.count.mockResolvedValue(1);

      const error = await getRpcError(service.setUserRole(1, { role: "USER" }));

      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(lastAdmin.$set).not.toHaveBeenCalled();
      expect(mockRoleRepository.findOne).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { value: "ADMIN" },
          lock: "UPDATE",
        })
      );
    });

    it("demotes ADMIN when another admin remains", async () => {
      const admin = makeUser(1, [adminRole]);
      const demoted = makeUser(1, [userRole]);
      mockRolesService.getRoleByValue.mockResolvedValue(userRole);
      mockUserRepository.findOne
        .mockResolvedValueOnce(admin)
        .mockResolvedValueOnce(demoted);
      mockRoleRepository.findOne.mockResolvedValue(adminRole);
      mockUserRepository.count.mockResolvedValue(2);

      const result = await service.setUserRole(1, { role: "USER" });

      expect(admin.$set).toHaveBeenCalledWith("roles", [userRole.id], {
        transaction: mockTransaction,
      });
      expect(result.role).toBe("USER");
    });

    it("sets role and rereads user with roles", async () => {
      const user = makeUser(2, [userRole]);
      const promoted = makeUser(2, [adminRole]);
      mockRolesService.getRoleByValue.mockResolvedValue(adminRole);
      mockUserRepository.findOne
        .mockResolvedValueOnce(user)
        .mockResolvedValueOnce(promoted);

      const result = await service.setUserRole(2, { role: "ADMIN" });

      expect(user.$set).toHaveBeenCalledWith("roles", [adminRole.id], {
        transaction: mockTransaction,
      });
      expect(mockUserRepository.count).not.toHaveBeenCalled();
      expect(result).toMatchObject({ id: 2, role: "ADMIN" });
    });
  });
});
