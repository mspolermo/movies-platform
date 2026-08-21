/** Имена env для JWT — один контракт для gateway и auth-users. */
export const JWT_ENV = {
  PRIVATE_KEY: "PRIVATE_KEY",
  ACCESS_EXPIRES_IN: "JWT_ACCESS_EXPIRES_IN",
} as const;

/** Defaults только для local/dev. В production PRIVATE_KEY обязателен. */
export const JWT_DEFAULTS = {
  /** Один fallback на все сервисы — иначе verify ≠ sign. */
  DEV_SECRET: "dev-only-secret",
  ACCESS_EXPIRES_IN: "15m",
} as const;
