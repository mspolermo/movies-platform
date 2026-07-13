import type {
  TCommentResponse,
  TCommentsPaginatedResponse,
  TToggleCommentLikeResponse,
} from "@common/types";

import { Test, TestingModule } from "@nestjs/testing";

import { CommentsController } from "../controllers/comments.controller";
import { CommentsService } from "../services/comments.service";

describe("CommentsController", () => {
  let controller: CommentsController;
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

  const mockCommentsPaginated: TCommentsPaginatedResponse = {
    items: [
      {
        id: 1,
        title: "Root",
        text: "Root comment",
        authorId: 2,
        filmId: 134,
        authorName: "Admin",
        likesCount: 0,
        createdAt: "2021-05-12T16:34:56.833Z",
      },
      {
        id: 2,
        title: "Reply",
        text: "Reply comment",
        authorId: 3,
        filmId: 134,
        authorName: "User",
        likesCount: 0,
        createdAt: "2021-06-16T16:39:56.833Z",
      },
    ],
    total: 2,
    page: 1,
    perPage: 20,
    hasMore: false,
  };

  const mockToggleResponse: TToggleCommentLikeResponse = {
    liked: true,
    likesCount: 1,
  };

  const mockCommentsService = {
    createComment: jest.fn(),
    getCommentsPaginatedByFilmId: jest.fn(),
    toggleCommentLike: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentsController],
      providers: [
        {
          provide: CommentsService,
          useValue: mockCommentsService,
        },
      ],
    }).compile();

    controller = module.get(CommentsController);
    service = module.get(CommentsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("createComment", () => {
    it("should create comment", async () => {
      mockCommentsService.createComment.mockResolvedValue(mockComment);

      const result = await controller.createComment({
        userId: mockComment.authorId,
        filmId: mockComment.filmId,
        authorName,
        dto: mockCommentDto,
      });

      expect(result).toEqual(mockComment);

      expect(service.createComment).toHaveBeenCalledWith(
        mockComment.authorId,
        mockComment.filmId,
        authorName,
        mockCommentDto
      );
    });
  });

  describe("getCommentsByFilmId", () => {
    it("should return paginated comments list", async () => {
      mockCommentsService.getCommentsPaginatedByFilmId.mockResolvedValue(
        mockCommentsPaginated
      );

      const result = await controller.getCommentsByFilmId({
        filmId: 134,
        page: 1,
        perPage: 20,
      });

      expect(result).toEqual(mockCommentsPaginated);

      expect(service.getCommentsPaginatedByFilmId).toHaveBeenCalledWith({
        filmId: 134,
        page: 1,
        perPage: 20,
      });
    });
  });

  describe("toggleCommentLike", () => {
    it("should toggle comment like", async () => {
      mockCommentsService.toggleCommentLike.mockResolvedValue(
        mockToggleResponse
      );

      const result = await controller.toggleCommentLike({
        userId: 2,
        commentId: 1,
      });

      expect(result).toEqual(mockToggleResponse);

      expect(service.toggleCommentLike).toHaveBeenCalledWith(2, 1);
    });
  });
});
