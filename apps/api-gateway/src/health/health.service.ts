import { HttpStatus, Injectable } from "@nestjs/common";

import { AuthService } from "../auth";
import { FilmsService } from "../films";

export type TDependencyStatus = "connected" | "disconnected";

export type TGatewayHealthResponse = {
  status: "ok" | "error";
  timestamp: string;
  service: "api-gateway";
  dependencies: {
    users: TDependencyStatus;
    films: TDependencyStatus;
  };
};

export type TGatewayLivenessResponse = {
  status: "ok";
  timestamp: string;
  service: "api-gateway";
};

const PING_TIMEOUT_MS = 3000;

@Injectable()
export class HealthService {
  constructor(
    private readonly authService: AuthService,
    private readonly filmsService: FilmsService
  ) {}

  live(): TGatewayLivenessResponse {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "api-gateway",
    };
  }

  async ready(): Promise<{
    body: TGatewayHealthResponse;
    httpStatus: HttpStatus;
  }> {
    const [users, films] = await Promise.all([
      this.pingWithTimeout(() => this.authService.ping()),
      this.pingWithTimeout(() => this.filmsService.ping()),
    ]);

    const ok = users === "connected" && films === "connected";

    return {
      body: {
        status: ok ? "ok" : "error",
        timestamp: new Date().toISOString(),
        service: "api-gateway",
        dependencies: { users, films },
      },
      httpStatus: ok ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
    };
  }

  private async pingWithTimeout(
    ping: () => Promise<unknown>
  ): Promise<TDependencyStatus> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const timeoutPromise = new Promise<"timeout">((resolve) => {
      timeoutId = setTimeout(() => resolve("timeout"), PING_TIMEOUT_MS);
    });

    try {
      const result = await Promise.race([
        ping().then(() => "ok" as const).catch(() => "fail" as const),
        timeoutPromise,
      ]);

      return result === "ok" ? "connected" : "disconnected";
    } finally {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
      // Late ping reject/resolve after timeout is swallowed by .catch on ping branch
    }
  }
}
