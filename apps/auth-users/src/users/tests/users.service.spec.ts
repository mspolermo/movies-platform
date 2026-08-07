import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import * as bcrypt from "bcryptjs";

import { RolesService } from "../../roles/services";
import { TokensService } from "../../tokens/services";
import { User } from "../models";
import { UsersService } from "../services";

jest.mock("bcryptjs");

describe("UsersService", () => {
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "password",
    name: "Test",
    createdAt: new Date("2023-05-10T16:34:56.833Z"),
    updatedAt: new Date("2023-05-10T16:34:56.833Z"),
    roles: [{ id: 2, value: "USER", description: "User role" }],
  };

  const mockUserDTO = {
    email: "test@example.com",
    password: "password",
  };

  const mockAuthDto = {
    email: "test@example.com",
    password: "password",
  };

  const mockRole = { id: 2, value: "USER", description: "User role" };

  const mockAuthResponse = {
    user: {
      id: mockUser.id,
      email: mockUser.email,
      name: mockUser.name,
      roles: mockUser.roles,
    },
    accessToken: "access-token",
    refreshToken: "refresh-token",
  };

  const mockUsersRepository = {
    create: jest.fn().mockResolvedValue(mockUser),
    getAllUsers: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn().mockResolvedValue(mockUser),
    findByPk: jest.fn().mockResolvedValue(mockUser.id),
    update: jest
      .fn()
      .mockResolvedValue(mockUser.id)
      .mockResolvedValue(mockUserDTO),
    destroy: jest.fn().mockResolvedValue(mockUser.id),
  };

  const mockRolesService = {
    getRoleByValue: jest.fn().mockResolvedValue(mockRole),
  };

  const mockTokensService = {
    createTokenPair: jest.fn().mockResolvedValue(mockAuthResponse),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User),
          useValue: mockUsersRepository,
        },
        RolesService,
        TokensService,
      ],
    })
      .overrideProvider(RolesService)
      .useValue(mockRolesService)
      .overrideProvider(TokensService)
      .useValue(mockTokensService)
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("validateUser", () => {
    it("should return the user if email and password are correct", async () => {
      jest.spyOn(mockUsersRepository, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockImplementation(async () => true);

      const result = await service.validateUser(mockAuthDto);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockAuthDto.email },
        include: { all: true },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockAuthDto.password,
        mockUser.password
      );
      expect(result).toEqual(mockUser);
    });

    it("should throw UnauthorizedException if email or password is incorrect", async () => {
      jest.spyOn(mockUsersRepository, "findOne").mockResolvedValue(null);

      await expect(service.validateUser(mockAuthDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockAuthDto.email },
        include: { all: true },
      });
    });
  });

  describe("login", () => {
    it("should return user and tokens if login is successful", async () => {
      jest
        .spyOn(service, "validateUser")
        .mockResolvedValue(mockUser as unknown as User);

      const result = await service.login(mockAuthDto);

      expect(service.validateUser).toHaveBeenCalledWith(mockAuthDto);
      expect(mockTokensService.createTokenPair).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockAuthResponse);
    });

    it("should throw UnauthorizedException if login is unsuccessful", async () => {
      jest
        .spyOn(service, "validateUser")
        .mockRejectedValue(new UnauthorizedException());
      jest.spyOn(mockTokensService, "createTokenPair");

      await expect(service.login(mockAuthDto)).rejects.toThrow(
        UnauthorizedException
      );
      expect(service.validateUser).toHaveBeenCalledWith(mockAuthDto);
      expect(mockTokensService.createTokenPair).not.toHaveBeenCalled();
    });
  });

  describe("createUser", () => {
    it('should create a new user with "USER" role if no user with the same email exists', async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);
      jest.spyOn(service, "createUserWithRole").mockResolvedValue(mockAuthResponse);

      const result = await service.createUser(mockUserDTO);

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUserDTO.email },
        include: { all: true },
      });
      expect(service.createUserWithRole).toHaveBeenCalledWith(
        mockUserDTO,
        "USER"
      );
      expect(result).toEqual(mockAuthResponse);
    });

    it("should throw an HttpException if a user with the same email already exists", async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);
      jest.spyOn(service, "createUserWithRole");

      await expect(service.createUser(mockUserDTO)).rejects.toThrowError(
        new HttpException(
          "Пользователь с таким email уже зарегистрирован",
          HttpStatus.BAD_REQUEST
        )
      );

      expect(mockUsersRepository.findOne).toHaveBeenCalledWith({
        where: { email: mockUserDTO.email },
        include: { all: true },
      });
      expect(service.createUserWithRole).not.toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    /** Достаёт payload RpcException для проверки statusCode. */
    const getRpcError = async (promise: Promise<unknown>) => {
      await expect(promise).rejects.toBeInstanceOf(RpcException);
      const error = await promise.catch((e: RpcException) => e);
      return (error as RpcException).getError() as {
        statusCode: number;
        message: string;
      };
    };

    it("returns authorized user response when user exists", async () => {
      mockUsersRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.getUserById(1)).resolves.toEqual({
        id: mockUser.id,
        email: mockUser.email,
        name: mockUser.name,
        roles: mockUser.roles.map((role) => ({
          id: role.id,
          value: role.value,
        })),
      });
    });

    it("throws RpcException 404 when user is missing", async () => {
      mockUsersRepository.findOne.mockResolvedValue(null);

      const error = await getRpcError(service.getUserById(999));

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
      expect(error.message).toBe("Пользователь не найден");
    });
  });
});
