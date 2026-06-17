import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { Profession } from "../models";
import { ProfessionsService } from "../services";

describe("ProfessionsService", () => {
  let service: ProfessionsService;

  const mockProfessionArray = [
    { id: 1, name: "Актёр" },
    { id: 2, name: "Режиссёр" },
    { id: 3, name: "Сценарист" },
  ];

  const mockProfessionRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          ProfessionsService,
          {
            provide: getModelToken(Profession),
            useValue: mockProfessionRepository,
          },
        ],
      }).compile();

    service =
      module.get<ProfessionsService>(ProfessionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllProfessions", () => {
    it("should return professions ordered by name", async () => {
      mockProfessionRepository.findAll.mockResolvedValue(
        mockProfessionArray
      );

      const result =
        await service.getAllProfessions();

      expect(result).toEqual(mockProfessionArray);

      expect(
        mockProfessionRepository.findAll
      ).toHaveBeenCalledWith({
        attributes: ["id", "name"],
        order: [["name", "ASC"]],
      });
    });
  });
});