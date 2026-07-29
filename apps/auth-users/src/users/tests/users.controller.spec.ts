import { HttpException, HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { TokensService } from "../../tokens/services";
import { UsersController } from "../controllers";
import { UsersService } from "../services";


jest.mock(
  "@common/dto",
  () => ({
    AuthDto: class {},
    CreateUserDto: class {},
  }),
  { virtual: true }
);

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    email: "test@example.com",
    password: "password",
    roles: [],
  };

  const mockUserDTO = {
    email: "test@example.com",
    password: "password",
  };

  const mockAuthDto = {
    email: "test@example.com",
    password: "password",
  };

  const mockUsersService = {
    createUser: jest.fn().mockResolvedValue({
      user: {
        id: 1,
        email: "test@example.com",
        password: "password",
        roles: [],
      },
      token: {
        token: "your-token-value",
      },
    }),
    login: jest.fn().mockResolvedValue({
      user: {
        id: 1,
        email: "test@example.com",
        password: "password",
        roles: [],
      },
      token: {
        token: "your-token-value",
      },
    }),
  };

  const mockTokensService = {
    refresh: jest.fn(),
    revoke: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService, TokensService],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .overrideProvider(TokensService)
      .useValue(mockTokensService)
      .compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("registration", () => {
    it("should create a new user", async () => {
      const createdUser = {
        user: mockUser,
        token: {
          token: "your-token-value",
        },
      };

      await service.createUser(mockUserDTO);

      const result = await controller.registration(mockUserDTO);

      expect(service.createUser).toHaveBeenCalledWith(mockUserDTO);
      expect(result).toEqual(createdUser);
    });

    it("should throw HttpException if user with the same email already exists", async () => {
      jest
        .spyOn(service, "createUser")
        .mockRejectedValue(
          new HttpException(
            "Пользователь с таким email уже зарегистрирован",
            HttpStatus.BAD_REQUEST
          )
        );

      await expect(controller.registration(mockUserDTO)).rejects.toThrowError(
        new HttpException(
          "Пользователь с таким email уже зарегистрирован",
          HttpStatus.BAD_REQUEST
        )
      );
      expect(service.createUser).toHaveBeenCalledWith(mockUserDTO);
    });
  });

  describe("login", () => {
    it("should return user and token", async () => {
      const mockToken = {
        token: "your-token-value",
      };

      const loginResult = {
        user: mockUser,
        token: mockToken,
      };

      await service.login(mockAuthDto);

      const result = await controller.login(mockAuthDto);

      expect(service.login).toHaveBeenCalledWith(mockAuthDto);
      expect(result).toEqual(loginResult);
    });
  });
});
