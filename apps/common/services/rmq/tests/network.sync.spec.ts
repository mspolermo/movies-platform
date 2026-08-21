import { readFileSync } from "fs";
import { join } from "path";

import {
  ALLOWED_ORIGINS,
  CLIENT_ORIGIN,
  NETWORK,
} from "@common/constants/network";
import {
  FILMS_QUEUE,
  RABBITMQ_URL,
  USERS_QUEUE,
} from "@common/services/rmq/rmq.constants";

/** `apps/common/services/rmq/tests` → repo root */
const repoRoot = join(__dirname, "../../../../../");

export const API_GATEWAY_URL = `http://localhost:${NETWORK.gateway.publish}`;

const parseEnvFile = (relativePath: string): Record<string, string> => {
  const raw = readFileSync(join(repoRoot, relativePath), "utf8");
  const out: Record<string, string> = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    out[trimmed.slice(0, eq)] = trimmed.slice(eq + 1);
  }
  return out;
};

describe("network.ts ↔ devops/network.env sync", () => {
  const env = parseEnvFile("devops/network.env");

  it("mirrors ports and URLs", () => {
    expect(env.BIND_HOST).toBe(NETWORK.bindHost);
    expect(Number(env.GATEWAY_PUBLISH_PORT)).toBe(NETWORK.gateway.publish);
    expect(Number(env.GATEWAY_LISTEN_PORT)).toBe(NETWORK.gateway.listen);
    expect(Number(env.AUTH_USERS_PUBLISH_PORT)).toBe(NETWORK.authUsers.publish);
    expect(Number(env.AUTH_USERS_LISTEN_PORT)).toBe(NETWORK.authUsers.listen);
    expect(Number(env.KINO_DB_PUBLISH_PORT)).toBe(NETWORK.kinoDb.publish);
    expect(Number(env.KINO_DB_LISTEN_PORT)).toBe(NETWORK.kinoDb.listen);
    expect(Number(env.POSTGRES_KINO_PUBLISH_PORT)).toBe(
      NETWORK.postgresKino.publish
    );
    expect(Number(env.POSTGRES_USERS_PUBLISH_PORT)).toBe(
      NETWORK.postgresUsers.publish
    );
    expect(Number(env.POSTGRES_LISTEN_PORT)).toBe(
      NETWORK.postgresKino.listen
    );
    expect(Number(env.POSTGRES_PORT)).toBe(NETWORK.postgresDialPort);
    expect(env.POSTGRES_DB_KINO).toBe(NETWORK.postgresKino.db);
    expect(env.POSTGRES_DB_USER).toBe(NETWORK.postgresUsers.db);
    expect(Number(env.RABBITMQ_AMQP_PUBLISH_PORT)).toBe(
      NETWORK.rabbitmq.amqpPublish
    );
    expect(Number(env.RABBITMQ_AMQP_LISTEN_PORT)).toBe(
      NETWORK.rabbitmq.amqpListen
    );
    expect(Number(env.RABBITMQ_MGMT_PUBLISH_PORT)).toBe(
      NETWORK.rabbitmq.mgmtPublish
    );
    expect(Number(env.RABBITMQ_MGMT_LISTEN_PORT)).toBe(
      NETWORK.rabbitmq.mgmtListen
    );
    expect(Number(env.PGADMIN_PUBLISH_PORT)).toBe(NETWORK.pgadmin.publish);
    expect(Number(env.PGADMIN_LISTEN_PORT)).toBe(NETWORK.pgadmin.listen);
    expect(env.CLIENT_ORIGIN).toBe(CLIENT_ORIGIN);
    expect(env.API_GATEWAY_URL).toBe(API_GATEWAY_URL);
    expect(env.ALLOWED_ORIGINS).toBe(ALLOWED_ORIGINS);
    expect(env.RABBITMQ_URL).toBe(RABBITMQ_URL);
    expect(env.USERS_QUEUE).toBe(USERS_QUEUE);
    expect(env.FILMS_QUEUE).toBe(FILMS_QUEUE);
  });

  it("Dockerfile ENV PORT matches listen ports", () => {
    const readPort = (dockerfile: string): number | null => {
      const text = readFileSync(join(repoRoot, dockerfile), "utf8");
      const m = text.match(/^\s*ENV PORT=(\d+)\s*$/m);
      return m ? Number(m[1]) : null;
    };

    expect(readPort("apps/api-gateway/Dockerfile")).toBe(
      NETWORK.gateway.listen
    );
    expect(readPort("apps/auth-users/Dockerfile")).toBe(
      NETWORK.authUsers.listen
    );
    expect(readPort("apps/kino-db/Dockerfile")).toBe(NETWORK.kinoDb.listen);
  });

  it("seed default POSTGRES_PORT matches postgresDialPort", () => {
    const seed = readFileSync(
      join(repoRoot, "devops/kino-db/seed/run-dev-seed.sh"),
      "utf8"
    );
    const m = seed.match(/POSTGRES_PORT="\$\{POSTGRES_PORT:-(\d+)\}"/);
    expect(m).not.toBeNull();
    expect(Number(m![1])).toBe(NETWORK.postgresDialPort);
  });

  it("compose RMQ: no DX :- fallback; apps URL without userinfo", () => {
    const compose = readFileSync(join(repoRoot, "docker-compose.yml"), "utf8");
    expect(compose).not.toMatch(/RABBITMQ_USER:-\s*mp\b/);
    expect(compose).not.toMatch(/RABBITMQ_PASS:-mp_dev_change_me/);
    expect(compose).toMatch(
      /RABBITMQ_URL=amqp:\/\/rabbitmq:\$\{RABBITMQ_AMQP_LISTEN_PORT/
    );
    expect(compose).not.toMatch(
      /RABBITMQ_URL=amqp:\/\/\$\{RABBITMQ_USER/
    );
  });
});
