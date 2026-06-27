import {
  Controller,
  Get,
  ServiceUnavailableException,
} from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
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
  ping(): true {
    return true;
  }

  @Get("/health")
  async health() {
    const timestamp = new Date().toISOString();

    try {
      await this.sequelize.authenticate();
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
}
