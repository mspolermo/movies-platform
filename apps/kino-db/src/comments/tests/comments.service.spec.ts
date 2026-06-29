import type {
  TCommentResponse,
  TCommentsTreeResponse,
} from "@common/types";

import { getModelToken } from "@nestjs/sequelize";
import { Test, TestingModule } from "@nestjs/testing";

import {
  mapCommentToResponse,
  mapCommentsToTree,
} from "../mappers";
import { Comment } from "../models/comments.model";
import { CommentsService } from "../services/comments.service";

jest.mock("../mappers", () => ({
  mapCommentToResponse: jest.fn(),
  mapCommentsToTree: jest.fn(),
}));

describe("CommentsService", () => {
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

  const comments = [
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
  ];

  const expectedTree: TCommentsTreeResponse = [
    [comments[0], comments[1]],
  ];

  const mockCommentsRepository = {
    create: jest.fn(),
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        {
          provide: getModelToken(Comment),
          useValue: mockCommentsRepository,
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
        mockCommentDto
      );

      expect(mockCommentsRepository.create).toHaveBeenCalledWith({
        header: mockCommentDto.header,
        value: mockCommentDto.value,
        authorId: mockComment.authorId,
        nickName: mockCommentDto.nickName,
        parentId: mockCommentDto.parentId,
        filmId: mockComment.filmId,
      });

      expect(mapCommentToResponse).toHaveBeenCalledWith(mockComment);

      expect(result).toEqual(mockComment);
    });
  });

  describe("getCommentsTreeByFilmId", () => {
    it("should return comments tree", async () => {
      mockCommentsRepository.findAll.mockResolvedValue(comments);
      (mapCommentsToTree as jest.Mock).mockReturnValue(expectedTree);

      const result = await service.getCommentsTreeByFilmId(134);

      expect(mockCommentsRepository.findAll).toHaveBeenCalledWith({
        where: {
          filmId: 134,
        },
        order: [["createdAt", "ASC"]],
      });

      expect(mapCommentsToTree).toHaveBeenCalledWith(comments);

      expect(result).toEqual(expectedTree);
    });
  });
});