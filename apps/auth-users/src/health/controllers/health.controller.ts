import {
  Controller,
  Get,
  ServiceUnavailableException,
} from "@nestjs/common";
import { MessagePattern, RpcException } from "@nestjs/microservices";
import { InjectConnection } from "@nestjs/sequelize";
import { Sequelize } from "sequelize";

import { authUsersRpc } from "@common/services";

@Controller()
export class HealthController {
  constructor(
    @InjectConnection()
    private readonly sequelize: Sequelize
  ) {}

  @MessagePattern(authUsersRpc.health.ping)
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
        service: "auth-users",
        database: "disconnected",
      });
    }

    return {
      status: "ok",
      timestamp,
      service: "auth-users",
      database: "connected",
    };
  }

  private async assertDb(): Promise<void> {
    await this.sequelize.authenticate();
  }
}
