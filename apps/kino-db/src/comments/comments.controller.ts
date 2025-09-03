import { Controller } from "@nestjs/common";
import { CommentsService } from "./comments.service";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CommentDTO } from "@common/dto";
import { TCommentBased } from "@common/types";

@Controller("comments")
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  @MessagePattern("createComment")
  async createComment(
    @Payload() data: { userId: number; filmId: number; dto: CommentDTO }
  ): Promise<TCommentBased> {
    const { userId, filmId, dto } = data;
    return await this.commentService.createComment(userId, filmId, dto);
  }

  @MessagePattern("getCommentsByFilmId")
  async getCommentsByFilmId(@Payload() id: number): Promise<TCommentBased[][]> {
    return await this.commentService.getAllCommentsByFilmId(id);
  }
}
