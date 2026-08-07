import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";

import { CommentsClient } from "../clients";

import { CommentsService } from "./comments.service";

describe("CommentsService (api-gateway)", () => {
  let service: CommentsService;

  const mockCommentsClient = {
    getCommentsByFilmId: jest.fn(),
    createComment: jest.fn(),
    toggleCommentLike: jest.fn(),
  };

  /** Ловит HttpException и возвращает его для ассертов. */
  const getHttpError = async (promise: Promise<unknown>): Promise<HttpException> => {
    await expect(promise).rejects.toBeInstanceOf(HttpException);
    const error = await promise.catch((e: HttpException) => e);
    return error as HttpException;
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: CommentsClient, useValue: mockCommentsClient },
      ],
    }).compile();

    service = module.get(CommentsService);
  });

  describe("getCommentsByFilmId", () => {
    it("maps RpcException to HttpException", async () => {
      mockCommentsClient.getCommentsByFilmId.mockRejectedValue({
        statusCode: 500,
        message: "kino-db down",
      });

      const error = await getHttpError(
        service.getCommentsByFilmId({ filmId: 1, page: 1, perPage: 10 })
      );

      expect(error.getStatus()).toBe(500);
    });
  });

  describe("createComment", () => {
    const dto = { title: "title", text: "hi" };

    it("hydrates authorName from JWT email and creates comment", async () => {
      mockCommentsClient.createComment.mockResolvedValue({ id: 10 });

      await expect(
        service.createComment(5, dto, 1, "john.doe@example.com")
      ).resolves.toEqual({ id: 10 });

      expect(mockCommentsClient.createComment).toHaveBeenCalledWith(
        5,
        dto,
        1,
        "john.doe"
      );
    });

    it("maps RpcException payload {statusCode: 404} to HttpException 404", async () => {
      mockCommentsClient.createComment.mockRejectedValue({
        statusCode: 404,
        message: "Фильм не найден",
      });

      const error = await getHttpError(
        service.createComment(5, dto, 1, "a@b.c")
      );

      expect(error.getStatus()).toBe(404);
      expect(error.getResponse()).toMatchObject({
        message: "Фильм не найден",
      });
    });

    it("maps serialized HttpException {status, response} to same status", async () => {
      mockCommentsClient.createComment.mockRejectedValue({
        status: 409,
        response: { statusCode: 409, message: "conflict" },
        message: "conflict",
      });

      const error = await getHttpError(
        service.createComment(5, dto, 1, "a@b.c")
      );

      expect(error.getStatus()).toBe(409);
    });

    it("falls back to 500 for unknown error shape", async () => {
      mockCommentsClient.createComment.mockRejectedValue(new Error("rmq down"));

      const error = await getHttpError(
        service.createComment(5, dto, 1, "a@b.c")
      );

      expect(error.getStatus()).toBe(500);
    });
  });

  describe("toggleCommentLike", () => {
    it("maps RpcException to HttpException", async () => {
      mockCommentsClient.toggleCommentLike.mockRejectedValue({
        statusCode: 404,
        message: "Комментарий не найден",
      });

      const error = await getHttpError(service.toggleCommentLike(9, 1));

      expect(error.getStatus()).toBe(404);
    });
  });
});
