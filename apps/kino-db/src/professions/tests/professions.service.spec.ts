import { Test, TestingModule } from "@nestjs/testing";
import { ProfessionsService } from "../professions.service";
import { Profession } from "../professions.model";
import { getModelToken } from "@nestjs/sequelize";

describe("ProfessionsService", () => {
  let service: ProfessionsService;

  const mockProfessionArray = [
    { id: 1, name: "Актёр" },
    { id: 2, name: "Режиссёр" },
    { id: 3, name: "Сценарист" },
  ];

  const mockProfessionsRepository = {
    findAll: jest.fn().mockResolvedValue(mockProfessionArray),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProfessionsService,
        {
          provide: getModelToken(Profession),
          useValue: mockProfessionsRepository,
        },
      ],
    }).compile();

    service = module.get<ProfessionsService>(ProfessionsService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllProfessions", () => {
    it("should return an array of professions", async () => {
      mockProfessionsRepository.findAll.mockResolvedValue(mockProfessionArray);
      const result = await service.getAllProfessions();
      expect(result).toEqual(mockProfessionArray);
      expect(mockProfessionsRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
