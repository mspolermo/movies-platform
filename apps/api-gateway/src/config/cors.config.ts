import { ConfigService } from "@nestjs/config";

import { ALLOWED_ORIGINS } from "@common/constants/network";

export const getCorsConfig = (configService: ConfigService) => {
  const NODE_ENV = configService.get<string>("NODE_ENV", "development");
  // пустая строка из compose ≠ unset для ConfigService.get(default)
  const allowedOrigins =
    configService.get<string>("ALLOWED_ORIGINS") || ALLOWED_ORIGINS;

  const corsOrigins = allowedOrigins.split(",").map((origin) => origin.trim());

  return {
    origin: NODE_ENV === "production" ? corsOrigins : true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  };
};
