import { Module } from "@nestjs/common";

import { JwtConfigModule } from "../jwt";
import { OriginGuard } from "../shared/guards";

import { AuthClient } from "./clients";
import { AuthController } from "./controllers";
import { AuthService } from "./services";

@Module({
  imports: [JwtConfigModule],
  controllers: [AuthController],
  providers: [AuthService, AuthClient, OriginGuard],
  exports: [AuthService],
})
export class AuthModule {}
