/**
 * Backend-only RMQ + PG DX/creds asserts + Nest DI tokens.
 * Клиент не импортирует — eslint (ADR-009).
 */

import { NETWORK } from "@common/constants/network";

/** DX defaults — `.env.example` / host-run fallback (non-prod). Прод — USER/PASS в `.env`. */
export const RABBITMQ_DX_USER = "mp";
export const RABBITMQ_DX_PASS = "mp_dev_change_me";

/** Host-run default. Compose apps: host-only URL `@rabbitmq` + USER/PASS (encode в factory). */
export const RABBITMQ_URL = `amqp://${RABBITMQ_DX_USER}:${RABBITMQ_DX_PASS}@localhost:${NETWORK.rabbitmq.amqpPublish}`;

export const USERS_QUEUE = "users_queue";
export const FILMS_QUEUE = "films_queue";

/** Nest DI tokens (api-gateway RMQ clients). */
export const FILMS_CLIENT = Symbol("FILMS_CLIENT");
export const USERS_CLIENT = Symbol("USERS_CLIENT");

/** DX defaults — те же, что в `.env.example` (local only). */
export const POSTGRES_DX_USER = "mp_dev";
export const POSTGRES_DX_PASS = "mp_dev_change_me";

export const PROD_SECRET_MIN_LENGTH = 16;

/**
 * Общая сила секрета @production: длина ≥16, pass ≠ user.
 * Вызывать после проверки empty / DX-пар.
 */
export const assertProdSecretStrength = (
  pass: string,
  user: string,
  label: string
): void => {
  if (pass.length < PROD_SECRET_MIN_LENGTH) {
    throw new Error(
      `${label}: production password must be at least ${PROD_SECRET_MIN_LENGTH} characters`
    );
  }

  if (pass === user) {
    throw new Error(
      `${label}: production password must not equal username`
    );
  }
};

/**
 * PG creds @production: required, ban root/root, ban DX-пару, strength.
 * Вне production — no-op.
 */
export const assertPostgresCredentialsForProduction = (
  user: string | undefined,
  pass: string | undefined,
  nodeEnv: string | undefined = process.env.NODE_ENV
): void => {
  if (nodeEnv !== "production") {
    return;
  }

  const username = (user || "").trim();
  const password = (pass || "").trim();

  if (!username || !password) {
    throw new Error(
      "Postgres config error: production requires POSTGRES_USER and POSTGRES_PASSWORD"
    );
  }

  if (username === "root" && password === "root") {
    throw new Error(
      'Postgres config error: production forbids credentials "root" / "root"'
    );
  }

  if (username === POSTGRES_DX_USER && password === POSTGRES_DX_PASS) {
    throw new Error(
      "Postgres config error: production forbids DX Postgres credentials (mp_dev / mp_dev_change_me)"
    );
  }

  assertProdSecretStrength(password, username, "Postgres config error");
};
