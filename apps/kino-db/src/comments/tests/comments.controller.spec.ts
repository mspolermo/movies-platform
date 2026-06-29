import type {
  TCommentResponse,
  TCommentsTreeResponse,
} from "@common/types";

import { Test, TestingModule } from "@nestjs/testing";

import { CommentsController } from "../controllers/comments.controller";
import { CommentsService } from "../services/comments.service";

describe("CommentsController", () => {
  let controller: CommentsController;
  let service: CommentsService;

  const mockComment: TCommentResponse = {
    id: 1,
    header: "This is header",
    value: "This is value",
    authorId: 2,
    parentId: 3,
    filmId: 134,
    nickName: "Admin",
  };

  const mockCommentDto = {
    header: "This is header",
    value: "This is value",
    parentId: 3,
    nickName: "Admin",
  };

  const mockCommentsTree: TCommentsTreeResponse = [
    [
      {
        id: 1,
        header: "Root",
        value: "Root comment",
        authorId: 2,
        parentId: null,
        filmId: 134,
        nickName: "Admin",
      },
      {
        id: 2,
        header: "Reply",
        value: "Reply comment",
        authorId: 3,
        parentId: 1,
        filmId: 134,
        nickName: "User",
      },
    ],
  ];

  const mockCommentsService = {
    createComment: jest.fn(),
    getCommentsTreeByFilmId: jest.fn(),
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
        dto: mockCommentDto,
      });

      expect(result).toEqual(mockComment);

      expect(service.createComment).toHaveBeenCalledWith(
        mockComment.authorId,
        mockComment.filmId,
        mockCommentDto
      );
    });
  });

  describe("getCommentsByFilmId", () => {
    it("should return comments tree", async () => {
      mockCommentsService.getCommentsTreeByFilmId.mockResolvedValue(
        mockCommentsTree
      );

      const result = await controller.getCommentsByFilmId(134);

      expect(result).toEqual(mockCommentsTree);

      expect(service.getCommentsTreeByFilmId).toHaveBeenCalledWith(134);
    });
  });
});