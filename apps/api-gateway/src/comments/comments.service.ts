import { Injectable, OnModuleInit } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "@nestjs/config";
import { RabbitMQConfig } from "../config";
import { TCommentBased } from "@common/types";
import { CommentDTO } from "@common/dto";

@Injectable()
export class CommentsService implements OnModuleInit {
  private clientData: ClientProxy;

  constructor(private configService: ConfigService) {
    this.clientData = RabbitMQConfig.createKinoDbClient(this.configService);
  }

  async onModuleInit(): Promise<void> {
    await RabbitMQConfig.connectWithRetry(this.clientData, "Comments Service");
  }

  async getCommentsByFilmId(filmId: number): Promise<TCommentBased[][]> {
    return await firstValueFrom(
      this.clientData.send("getCommentsByFilmId", filmId)
    );
  }

  async createComment(
    filmId: number,
    dto: CommentDTO,
    userId: number
  ): Promise<TCommentBased> {
    return await firstValueFrom(
      this.clientData.send("createComment", { filmId, dto, userId })
    );
  }
}
