import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { RabbitMQConfig } from "../config";
import { CommentDTO } from "./dto";
import { Comment } from "../shared/interfaces";

@Injectable()
export class CommentsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Comments Service");
  }

  async getCommentsByFilmId(filmId: number): Promise<Comment[]> {
    return await firstValueFrom(
      this.clientData.send("getCommentsByFilmId", filmId)
    );
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number
  ): Promise<Comment> {
    return await firstValueFrom(
      this.clientData.send("createComment", { filmId, dto, userId })
    );
  }
}
