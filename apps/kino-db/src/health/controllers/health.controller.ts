import {
  Controller,
  Get,
  ServiceUnavailableException,
} from "@nestjs/common";
import { MessagePattern, RpcException } from "@nestjs/microservices";
import { InjectConnection } from "@nestjs/sequelize";
import { Sequelize } from "sequelize";

import { kinoDbRpc } from "@common/services";

@Controller()
export class HealthController {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  @MessagePattern(kinoDbRpc.health.ping)
  async ping(): Promise<true> {
    try {
      await this.assertDb();
    } catch {
      throw new RpcException({
        statusCode: 503,
        message: "database disconnected",
      });
    }
    return true;
  }

  @Get("/health")
  async health() {
    const timestamp = new Date().toISOString();

    try {
      await this.assertDb();
    } catch {
      throw new ServiceUnavailableException({
        status: "error",
        timestamp,
        service: "kino-db",
        database: "disconnected",
      });
    }

    return {
      status: "ok",
      timestamp,
      service: "kino-db",
      database: "connected",
    };
  }

  private async assertDb(): Promise<void> {
    await this.sequelize.authenticate();
  }
}
