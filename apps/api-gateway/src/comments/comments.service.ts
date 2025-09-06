import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TCommentBased } from "@common/types";
import { CommentDTO } from "@common/dto";
import { BaseMicroserviceService } from "../shared/services";

@Injectable()
export class CommentsService extends BaseMicroserviceService {
  constructor(configService: ConfigService) {
    super(configService, "Comments Service");
  }

  async getCommentsByFilmId(filmId: number): Promise<TCommentBased[][]> {
    return this.sendMessage("getCommentsByFilmId", filmId);
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number
  ): Promise<TCommentBased> {
    return this.sendMessage("createComment", { filmId, dto, userId });
  }
}
