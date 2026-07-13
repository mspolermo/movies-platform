import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
} from "@common/types";

import { NotFoundException } from "@nestjs/common";
import { getConnectionToken, getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import {
  mapCommentToResponse,
  mapCommentsToResponseList,
} from "../mappers";
import { CommentLike } from "../models/commentLike.model";
import { Comment } from "../models/comments.model";
import { CommentsService } from "../services/comments.service";

jest.mock("../mappers", () => ({
  mapCommentToResponse: jest.fn(),
  mapCommentsToResponseList: jest.fn(),
}));

describe("CommentsService", () => {
  let service: CommentsService;

  const mockComment: TCommentResponse = {
    id: 1,
    title: "This is title",
    text: "This is text",
    authorId: 2,
    filmId: 134,
    authorName: "Admin",
    likesCount: 0,
    createdAt: "2021-05-12T16:34:56.833Z",
  };

  const mockCommentDto = {
    title: "This is title",
    text: "This is text",
  };

  const authorName = "admin";

  const comments = [
    {
      id: 1,
      title: "Root",
      text: "Root comment",
      authorId: 2,
      filmId: 134,
      authorName: "Admin",
      createdAt: "2021-05-12T16:34:56.833Z",
    },
  ];

  const expectedPaginated: TCommentsPaginatedResponse = {
    items: [mockComment],
    total: 1,
    page: 1,
    perPage: 20,
    hasMore: false,
  };

  const mockCommentsRepository = {
    create: jest.fn(),
    findAndCountAll: jest.fn(),
    findByPk: jest.fn(),
  };

  const mockCommentLikeRepository = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    count: jest.fn(),
    destroy: jest.fn(),
  };

  const mockTransaction = {};

  const mockSequelize = {
    transaction: jest.fn(
      async (callback: (transaction: unknown) => Promise<unknown>) =>
        callback(mockTransaction)
    ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment),
          useValue: mockCommentsRepository,
        },
        {
          provide: getModelToken(CommentLike),
          useValue: mockCommentLikeRepository,
        },
        {
          provide: getConnectionToken(),
          useValue: mockSequelize,
        },
      ],
    }).compile();

    service = module.get(CommentsService);

    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("createComment", () => {
    it("should create comment", async () => {
      mockCommentsRepository.create.mockResolvedValue(mockComment);
      (mapCommentToResponse as jest.Mock).mockReturnValue(mockComment);

      const result = await service.createComment(
        mockComment.authorId,
        mockComment.filmId,
        authorName,
        mockCommentDto
      );

      expect(mockCommentsRepository.create).toHaveBeenCalledWith({
        title: mockCommentDto.title,
        text: mockCommentDto.text,
        authorId: mockComment.authorId,
        authorName,
        filmId: mockComment.filmId,
      });

      expect(mapCommentToResponse).toHaveBeenCalledWith(mockComment, {
        likesCount: 0,
        liked: false,
      });

      expect(result).toEqual(mockComment);
    });
  });

  describe("getCommentsPaginatedByFilmId", () => {
    it("should return paginated comments list", async () => {
      mockCommentsRepository.findAndCountAll.mockResolvedValue({
        count: 1,
        rows: comments,
      });
      mockCommentLikeRepository.findAll.mockResolvedValue([]);
      (mapCommentsToResponseList as jest.Mock).mockReturnValue(
        expectedPaginated.items
      );

      const result = await service.getCommentsPaginatedByFilmId({
        filmId: 134,
        page: 1,
        perPage: 20,
      });

      expect(mockCommentsRepository.findAndCountAll).toHaveBeenCalledWith({
        where: {
          filmId: 134,
        },
        order: [["createdAt", "DESC"]],
        limit: 20,
        offset: 0,
      });

      expect(mapCommentsToResponseList).toHaveBeenCalled();

      expect(result).toEqual(expectedPaginated);
    });
  });

  describe("toggleCommentLike", () => {
    it("should create like when not exists", async () => {
      mockCommentsRepository.findByPk.mockResolvedValue(comments[0]);
      mockCommentLikeRepository.findOne.mockResolvedValue(null);
      mockCommentLikeRepository.create.mockResolvedValue({});
      mockCommentLikeRepository.count.mockResolvedValue(1);

      const result = await service.toggleCommentLike(2, 1);

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(mockCommentsRepository.findByPk).toHaveBeenCalledWith(1, {
        transaction: mockTransaction,
        lock: expect.anything(),
      });
      expect(result).toEqual({ liked: true, likesCount: 1 });
    });

    it("should remove like when exists", async () => {
      const existingLike = { destroy: jest.fn() };
      mockCommentsRepository.findByPk.mockResolvedValue(comments[0]);
      mockCommentLikeRepository.findOne.mockResolvedValue(existingLike);
      mockCommentLikeRepository.count.mockResolvedValue(0);

      const result = await service.toggleCommentLike(2, 1);

      expect(existingLike.destroy).toHaveBeenCalledWith({
        transaction: mockTransaction,
      });
      expect(result).toEqual({ liked: false, likesCount: 0 });
    });

    it("should throw when comment not found", async () => {
      mockCommentsRepository.findByPk.mockResolvedValue(null);

      await expect(service.toggleCommentLike(2, 999)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
