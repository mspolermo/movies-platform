import type { JwtModuleOptions } from "@nestjs/jwt";

import {
  JWT_DEFAULTS,
  JWT_ENV,
  resolveJwtSecret,
} from "@common/constants";

export const BCRYPT_ROUNDS = 10;

export const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** Issuer access JWT. SECRET = тот же PRIVATE_KEY, что у api-gateway. */
export const getJwtModuleConfig = (): JwtModuleOptions => {
  const secret = resolveJwtSecret(
    process.env[JWT_ENV.PRIVATE_KEY],
    process.env.NODE_ENV
  );

  return {
    secret,
    signOptions: {
      expiresIn:
        process.env[JWT_ENV.ACCESS_EXPIRES_IN] || JWT_DEFAULTS.ACCESS_EXPIRES_IN,
    },
  };
};
