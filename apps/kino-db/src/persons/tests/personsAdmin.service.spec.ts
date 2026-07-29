import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";
import { Sequelize } from "sequelize-typescript";

import { FilmPerson } from "../../films/models";
import { Profession } from "../../professions/models";
import { Person, PersonProfession } from "../models";
import { PersonsAdminService } from "../services";

describe("PersonsAdminService", () => {
  let service: PersonsAdminService;

  const mockPerson = {
    id: 1,
    nameRu: "Киану Ривз",
    nameEn: "Keanu Reeves",
    photoUrl: null,
    professions: [{ id: 2, name: "актёр" }],
    update: jest.fn(),
    destroy: jest.fn(),
    $set: jest.fn(),
  };

  const mockPersonRepository = {
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
    create: jest.fn(),
  };

  const mockProfessionRepository = { count: jest.fn() };
  const mockPersonProfessionRepository = { destroy: jest.fn() };
  const mockFilmPersonRepository = { count: jest.fn() };

  const mockTransaction = { id: "tx" };
  const mockSequelize = {
    transaction: jest.fn(
      async (callback: (t: unknown) => Promise<void>) =>
        await callback(mockTransaction)
    ),
  };

  /** Достаёт payload RpcException для проверки statusCode. */
  const getRpcError = async (promise: Promise<unknown>) => {
    await expect(promise).rejects.toBeInstanceOf(RpcException);
    const error = await promise.catch((e: RpcException) => e);
    return (error as RpcException).getError() as {
      statusCode: number;
      message: string;
    };
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PersonsAdminService,
        { provide: getModelToken(Person), useValue: mockPersonRepository },
        {
          provide: getModelToken(Profession),
          useValue: mockProfessionRepository,
        },
        {
          provide: getModelToken(PersonProfession),
          useValue: mockPersonProfessionRepository,
        },
        {
          provide: getModelToken(FilmPerson),
          useValue: mockFilmPersonRepository,
        },
        { provide: Sequelize, useValue: mockSequelize },
      ],
    }).compile();

    service = module.get<PersonsAdminService>(PersonsAdminService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getPersonById", () => {
    it("returns item with professionIds", async () => {
      mockPersonRepository.findByPk.mockResolvedValue(mockPerson);

      const result = await service.getPersonById(1);

      expect(result).toEqual({
        id: 1,
        nameRu: "Киану Ривз",
        nameEn: "Keanu Reeves",
        photoUrl: "",
        professionIds: [2],
      });
    });

    it("throws 404 for unknown id", async () => {
      mockPersonRepository.findByPk.mockResolvedValue(null);

      const error = await getRpcError(service.getPersonById(999));

      expect(error.statusCode).toBe(HttpStatus.NOT_FOUND);
    });
  });

  describe("createPerson", () => {
    it("throws 400 when some professionIds do not exist", async () => {
      mockProfessionRepository.count.mockResolvedValue(1);

      const error = await getRpcError(
        service.createPerson({
          nameRu: "X",
          nameEn: "X",
          photoUrl: "",
          professionIds: [1, 999],
        })
      );

      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(mockPersonRepository.create).not.toHaveBeenCalled();
    });

    it("creates person and sets professions", async () => {
      mockProfessionRepository.count.mockResolvedValue(1);
      mockPersonRepository.create.mockResolvedValue(mockPerson);
      mockPersonRepository.findByPk.mockResolvedValue(mockPerson);

      const result = await service.createPerson({
        nameRu: "Киану Ривз",
        nameEn: "Keanu Reeves",
        photoUrl: "",
        professionIds: [2],
      });

      expect(mockPerson.$set).toHaveBeenCalledWith("professions", [2]);
      expect(result.professionIds).toEqual([2]);
    });
  });

  describe("updatePerson", () => {
    it("validates professionIds before $set", async () => {
      mockPersonRepository.findByPk.mockResolvedValue(mockPerson);
      mockProfessionRepository.count.mockResolvedValue(0);

      const error = await getRpcError(
        service.updatePerson(1, { professionIds: [999] })
      );

      expect(error.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(mockPerson.$set).not.toHaveBeenCalled();
    });
  });

  describe("deletePerson", () => {
    it("throws 409 when person is used in films (Restrict)", async () => {
      mockPersonRepository.findByPk.mockResolvedValue(mockPerson);
      mockFilmPersonRepository.count.mockResolvedValue(5);

      const error = await getRpcError(service.deletePerson(1));

      expect(error.statusCode).toBe(HttpStatus.CONFLICT);
      expect(mockPerson.destroy).not.toHaveBeenCalled();
    });

    it("deletes free person with PersonProfession cleanup in transaction", async () => {
      mockPersonRepository.findByPk.mockResolvedValue(mockPerson);
      mockFilmPersonRepository.count.mockResolvedValue(0);

      await expect(service.deletePerson(1)).resolves.toBe(true);

      expect(mockPersonProfessionRepository.destroy).toHaveBeenCalledWith({
        where: { A: 1 },
        transaction: mockTransaction,
      });
      expect(mockPerson.destroy).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
    });
  });
});
