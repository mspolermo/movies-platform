import { Test, TestingModule } from "@nestjs/testing";

import { ProfessionsController } from "../controllers";
import { ProfessionsService } from "../services";

describe("ProfessionsController", () => {
  let controller: ProfessionsController;

  const mockProfessions = [
    { id: 1, name: "Актёр" },
    { id: 2, name: "Режиссёр" },
  ];

  const mockProfessionsService = {
    getAllProfessions: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [ProfessionsController],
        providers: [
          {
            provide: ProfessionsService,
            useValue: mockProfessionsService,
          },
        ],
      }).compile();

    controller =
      module.get<ProfessionsController>(
        ProfessionsController
      );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAllProfessions", () => {
    it("should return professions", async () => {
      mockProfessionsService.getAllProfessions.mockResolvedValue(
        mockProfessions
      );

      const result =
        await controller.getAllProfessions();

      expect(result).toEqual(mockProfessions);

      expect(
        mockProfessionsService.getAllProfessions
      ).toHaveBeenCalledTimes(1);
    });
  });
});