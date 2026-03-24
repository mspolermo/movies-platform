import type { TCommentResponse, TCommentsTreeResponse } from "@common/types";

import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { CommentDTO } from "@common/dto";
import { kinoDbRpc } from "@common/messaging";

import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class CommentsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Comments Service");
  }

  async getCommentsByFilmId(filmId: number): Promise<TCommentsTreeResponse> {
    return this.sendMessage(kinoDbRpc.comments.getByFilmId, filmId);
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number
  ): Promise<TCommentResponse> {
    return this.sendMessage(kinoDbRpc.comments.create, { filmId, dto, userId });
  }
}
