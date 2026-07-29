import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { AdminKinoDbClient } from "../clients";
import { AdminFilmsService } from "../services";

describe("AdminFilmsService", () => {
  let service: AdminFilmsService;

  const mockClient = {
    listFilms: jest.fn(),
    getFilmById: jest.fn(),
    createFilm: jest.fn(),
    updateFilm: jest.fn(),
    deleteFilm: jest.fn(),
  };

  /** Ловит HttpException и возвращает его для ассертов. */
  const getHttpError = async (promise: Promise<unknown>) => {
    await expect(promise).rejects.toBeInstanceOf(HttpException);
    const error = await promise.catch((e: HttpException) => e);
    return error as HttpException;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminFilmsService,
        { provide: AdminKinoDbClient, useValue: mockClient },
      ],
    }).compile();

    service = module.get<AdminFilmsService>(AdminFilmsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("passes through successful list response", async () => {
    const page = { items: [], total: 0, page: 1, perPage: 50, hasMore: false };
    mockClient.listFilms.mockResolvedValue(page);

    await expect(service.listFilms({ page: 1 })).resolves.toEqual(page);
    expect(mockClient.listFilms).toHaveBeenCalledWith({ page: 1 });
  });

  it("maps RpcException payload {statusCode: 404} to HttpException 404", async () => {
    mockClient.getFilmById.mockRejectedValue({
      statusCode: 404,
      message: "Фильм не найден",
    });

    const error = await getHttpError(service.getFilmById(999));

    expect(error.getStatus()).toBe(404);
    expect(error.getResponse()).toMatchObject({ message: "Фильм не найден" });
  });

  it("maps serialized HttpException {status, response} to same status", async () => {
    mockClient.deleteFilm.mockRejectedValue({
      status: 409,
      response: { statusCode: 409, message: "Конфликт" },
      message: "Конфликт",
    });

    const error = await getHttpError(service.deleteFilm(1));

    expect(error.getStatus()).toBe(409);
  });

  it("falls back to 500 for unknown error shape", async () => {
    mockClient.createFilm.mockRejectedValue(new Error("rmq down"));

    const error = await getHttpError(service.createFilm({ filmNameRu: "X" }));

    expect(error.getStatus()).toBe(500);
  });
});
