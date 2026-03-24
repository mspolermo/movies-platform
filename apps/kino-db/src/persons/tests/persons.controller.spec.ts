import { Test, TestingModule } from "@nestjs/testing";

import { PersonsController } from "../persons.controller";
import { PersonsService } from "../persons.service";

describe("PersonsController", () => {
  let controller: PersonsController;

  const mockPerson = {
    id: 1,
    photoUrl: "http://someUrl.com",
    nameRu: "Джон Сина",
    nameEn: "John Sean",
    professions: [1, 2, 3],
  };

  const mockPersonsArray = [
    {
      id: 1,
      photoUrl: "http://someUrl.com",
      nameRu: "Джон Сина",
      nameEn: "John Sean",
      professions: [1, 2, 3],
    },
    {
      id: 2,
      photoUrl: "http://someUrl2.com",
      nameRu: "Джон Сильвер",
      nameEn: "John Silver",
      professions: [1, 3],
    },
  ];

  const mockPersonsService = {
    getPersonById: jest.fn().mockResolvedValue(mockPerson),
    findPersonsByNameAndProfession: jest
      .fn()
      .mockResolvedValue(mockPersonsArray),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [
        {
          provide: PersonsService,
          useValue: mockPersonsService,
        },
      ],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("getPersonById", () => {
    it("should return person with pagination params", async () => {
      const id = 1;
      const filmsLimit = 10;
      const filmsOffset = 5;
      await controller.getPersonById({id, filmsLimit, filmsOffset});
      expect(mockPersonsService.getPersonById).toHaveBeenCalledWith(id, {
        filmsLimit: 10,
        filmsOffset: 5,
      });
    });
  });

  describe("findPersonsByNameAndProfession", () => {
    it("should return persons", async () => {
      const data = {
        professionId: 1,
        name: "Джон",
      };
      expect(await controller.findPersonsByNameAndProfession(data)).toEqual(
        mockPersonsArray
      );
      expect(
        mockPersonsService.findPersonsByNameAndProfession
      ).toHaveBeenCalledTimes(1);
    });
  });
});
