import { JWT_DEFAULTS, JWT_ENV } from "../constants";

/**
 * Резолв секрета: prod без ключа — throw; иначе общий dev-fallback.
 */
export const resolveJwtSecret = (
  secret: string | undefined,
  nodeEnv: string | undefined
): string => {
  if (secret) {
    return secret;
  }

  if (nodeEnv === "production") {
    throw new Error(`${JWT_ENV.PRIVATE_KEY} is required in production`);
  }

  return JWT_DEFAULTS.DEV_SECRET;
};