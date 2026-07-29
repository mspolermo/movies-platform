import { Controller, Get } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";

import { authUsersRpc } from "@common/services";

@Controller()
export class HealthController {
  @MessagePattern(authUsersRpc.health.ping)
  async ping(): Promise<true> {
    return true;
  }

  @Get("/health")
  async health() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "auth-users",
      database: "postgres",
    };
  }
}
