import { Module } from "@nestjs/common";

import { AuthClient } from "./clients";
import { AuthController } from "./controllers";
import { OriginGuard } from "./guards";
import { AuthService } from "./services";

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthClient, OriginGuard],
  exports: [AuthService],
})
export class AuthModule {}
