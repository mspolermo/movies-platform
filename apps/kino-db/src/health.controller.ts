import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { kinoDbRpc } from "@common/services";

@Controller()
export class HealthController {
  @MessagePattern(kinoDbRpc.health.ping)
  async ping(): Promise<true> {
    return true;
  }

  @Get("/health")
  async health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "kino-db",
      database: "postgres",
    };
  }
}
