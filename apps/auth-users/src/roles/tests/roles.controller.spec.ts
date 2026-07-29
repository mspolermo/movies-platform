import { Test, TestingModule } from "@nestjs/testing";

import { RolesController } from "../controllers";
import { RolesService } from "../services";

describe("RolesController", () => {
  let controller: RolesController;

  const mockRole = { id: 1, value: "ADMIN" };

  const mockRolesService = {
    getRoleByValue: jest.fn().mockResolvedValue(mockRole),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: mockRolesService,
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getByValue", () => {
    it("should get role by value", async () => {
      const roleValue = "ADMIN";
      expect(await controller.getByValue(roleValue)).toEqual(mockRole);
      expect(mockRolesService.getRoleByValue).toHaveBeenCalledTimes(1);
    });
  });
});
