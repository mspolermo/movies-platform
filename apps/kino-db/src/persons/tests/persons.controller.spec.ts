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
    getPersonProfile: jest.fn().mockResolvedValue(mockPerson),
    getPersonFilmography: jest.fn().mockResolvedValue({
      items: [],
      total: 0,
      page: 1,
      perPage: 10,
      hasMore: false,
    }),
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
    it("should return person profile by id", async () => {
      const id = 1;
      await controller.getPersonById({ id });
      expect(mockPersonsService.getPersonProfile).toHaveBeenCalledWith(id);
    });
  });

  describe("getPersonFilmography", () => {
    it("should return filmography", async () => {
      await controller.getPersonFilmography({ id: 1, limit: 10, offset: 5 });
      expect(mockPersonsService.getPersonFilmography).toHaveBeenCalledWith({
        id: 1,
        limit: 10,
        offset: 5,
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
