import { Test, TestingModule } from "@nestjs/testing";

import { CountriesController } from "../controllers";
import { CountriesService } from "../services";

describe("CountriesController", () => {
  let controller: CountriesController;
  let service: CountriesService;

  const mockCountries = [
    {
      countryName: "США",
      countryNameEn: "USA",
    },
    {
      countryName: "Россия",
      countryNameEn: "Russia",
    },
  ];

  const mockCountriesService = {
    getAllCountries: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule =
      await Test.createTestingModule({
        controllers: [CountriesController],
        providers: [
          {
            provide: CountriesService,
            useValue: mockCountriesService,
          },
        ],
      }).compile();

    controller =
      module.get<CountriesController>(
        CountriesController
      );

    service =
      module.get<CountriesService>(
        CountriesService
      );
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getAllCountries", () => {
    it("should return countries list", async () => {
      mockCountriesService.getAllCountries.mockResolvedValue(
        mockCountries
      );

      const result =
        await controller.getAllCountries();

      expect(result).toEqual(mockCountries);

      expect(
        service.getAllCountries
      ).toHaveBeenCalledTimes(1);
    });
  });
});