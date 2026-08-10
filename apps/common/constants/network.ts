/**
 * SoT публичной топологии (Nest listen/publish, client/SSR URL, CORS DX).
 * Зеркало Compose: `devops/network.env` (см. `devops/README.md`, ADR-009).
 * RMQ URL/creds/очереди — `network.rmq.ts` (backend-only).
 */

export const NETWORK = {
  bindHost: "127.0.0.1",
  gateway: { publish: 5001, listen: 5000 },
  authUsers: { publish: 3001, listen: 3001 },
  kinoDb: { publish: 3002, listen: 3002 },
  postgresKino: { publish: 5432, listen: 5432, db: "kino" },
  postgresUsers: { publish: 5433, listen: 5432, db: "user" },
  /** Dial port внутри Docker-сети / контейнера к Postgres. */
  postgresDialPort: 5432,
  rabbitmq: {
    amqpPublish: 5672,
    amqpListen: 5672,
    mgmtPublish: 15672,
    mgmtListen: 15672,
  },
  pgadmin: { publish: 5050, listen: 80 },
} as const;

export const API_GATEWAY_URL = `http://localhost:${NETWORK.gateway.publish}`;
export const CLIENT_ORIGIN = "http://localhost:3000";
/** CORS / OriginGuard fallback (DX client). Prod — явный ALLOWED_ORIGINS в env. */
export const ALLOWED_ORIGINS = CLIENT_ORIGIN;
