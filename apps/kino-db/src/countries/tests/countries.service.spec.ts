import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { Country } from "../models";
import { CountriesService } from "../services";

describe("CountriesService", () => {
  let service: CountriesService;

  const mockCountries = [
    {
      toJSON: () => ({
        countryName: "США",
        countryNameEn: "USA",
      }),
    },
    {
      toJSON: () => ({
        countryName: "Россия",
        countryNameEn: "Russia",
      }),
    },
  ];

  const mockCountryRepository = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        providers: [
          CountriesService,
          {
            provide: getModelToken(Country),
            useValue: mockCountryRepository,
          },
        ],
      }).compile();

    service =
      module.get<CountriesService>(
        CountriesService
      );
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllCountries", () => {
    it("should return mapped countries", async () => {
      mockCountryRepository.findAll.mockResolvedValue(
        mockCountries
      );

      const result =
        await service.getAllCountries();

      expect(result).toEqual([
        {
          countryName: "США",
          countryNameEn: "USA",
        },
        {
          countryName: "Россия",
          countryNameEn: "Russia",
        },
      ]);

      expect(
        mockCountryRepository.findAll
      ).toHaveBeenCalledWith({
        attributes: [
          "id",
          "countryName",
          "countryNameEn",
        ],
        order: [["countryName", "ASC"]],
      });
    });
  });
});