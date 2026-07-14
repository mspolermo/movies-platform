import { ConfigService } from "@nestjs/config";

import {
  JWT_ENV,
  resolveJwtSecret,
} from "@common/constants";

/**
 * Verify-only JWT на gateway: подпись делает auth-users.
 * SECRET должен совпадать с PRIVATE_KEY у auth-users.
 */
export const getJwtConfig = (configService: ConfigService) => {
  const secret = resolveJwtSecret(
    configService.get<string>(JWT_ENV.PRIVATE_KEY),
    configService.get<string>("NODE_ENV")
  );

  return { secret };
};
