import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import { Country } from "../models";
import { CountriesService } from "../services";

describe("CountriesService", () => {
  let service: CountriesService;

  const mockCountry = [{ countryName: "США", countryNameEn: "USA" }];

  const mockCountriesRepository = {
    findAll: jest.fn().mockResolvedValue(mockCountry),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CountriesService,
        {
          provide: getModelToken(Country),
          useValue: mockCountriesRepository,
        },
      ],
    }).compile();

    service = module.get<CountriesService>(CountriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("getAllCountries", () => {
    it("should return an array of countries", async () => {
      mockCountriesRepository.findAll.mockResolvedValue(mockCountry);

      expect(await service.getAllCountries()).toEqual(mockCountry);
      expect(mockCountriesRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });
});
