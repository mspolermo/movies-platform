import { Module } from "@nestjs/common";

import { OriginGuard } from "../shared/guards";

import { AuthClient } from "./clients";
import { AuthController } from "./controllers";
import { AuthService } from "./services";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthClient, OriginGuard],
  exports: [AuthService],
})
export class AuthModule {}
