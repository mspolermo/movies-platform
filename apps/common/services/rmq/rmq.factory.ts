import { ConfigService } from "@nestjs/config";
import {
  ClientProxyFactory,
  MicroserviceOptions,
  Transport,
} from "@nestjs/microservices";

import { NETWORK } from "@common/constants/network";
import {
  FILMS_QUEUE,
  RABBITMQ_DX_PASS,
  RABBITMQ_DX_USER,
  RABBITMQ_URL as RABBITMQ_URL_DEFAULT,
  USERS_QUEUE,
} from "@common/constants/network.rmq";

type TRmqUrlOptions = {
  url?: string;
  user?: string;
  pass?: string;
  host?: string;
};

const QUEUE_DEFAULTS: Record<string, string> = {
  USERS_QUEUE,
  FILMS_QUEUE,
};

const amqpToHttp = (url: string): string =>
  url.replace(/^amqps?:/i, (scheme) =>
    /^amqps:/i.test(scheme) ? "https:" : "http:"
  );

const schemeOf = (url: string): "amqp" | "amqps" =>
  /^amqps:/i.test(url) ? "amqps" : "amqp";

/**
 * Resolve RMQ URL:
 * - URL with userinfo → use as-is
 * - URL without userinfo + USER/PASS → inject encoded credentials (keeps amqp/amqps)
 * - USER/PASS only → build amqp://…@host (host or localhost:amqpPublish)
 */
export const resolveRmqUrl = (opts: TRmqUrlOptions): string => {
  const { url: configuredUrl, user, pass, host } = opts;

  if (configuredUrl) {
    let parsed: URL;
    try {
      parsed = new URL(amqpToHttp(configuredUrl));
    } catch {
      throw new Error("RMQ config error: invalid RABBITMQ_URL");
    }

    if (parsed.username) {
      return configuredUrl;
    }

    if (user && pass) {
      const authority = `${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${parsed.host}`;
      const path =
        parsed.pathname && parsed.pathname !== "/" ? parsed.pathname : "";
      return `${schemeOf(configuredUrl)}://${authority}${path}${parsed.search}`;
    }

    return configuredUrl;
  }

  if (user && pass) {
    const hostPort =
      host ?? `localhost:${NETWORK.rabbitmq.amqpPublish}`;
    return `amqp://${encodeURIComponent(user)}:${encodeURIComponent(pass)}@${hostPort}`;
  }

  throw new Error(
    "RMQ config error: RABBITMQ_URL (or RABBITMQ_USER+RABBITMQ_PASS) is required"
  );
};

/**
 * DX default URL только вне production.
 * В production без env → undefined → resolveRmqUrl throw.
 */
export const selectRmqUrlOrDxDefault = (opts: {
  configuredUrl: string;
  user?: string;
  pass?: string;
  nodeEnv?: string;
}): string | undefined => {
  const { configuredUrl, user, pass, nodeEnv = process.env.NODE_ENV } = opts;

  if (configuredUrl) {
    return configuredUrl;
  }

  if (user && pass) {
    return undefined;
  }

  if (nodeEnv === "production") {
    return undefined;
  }

  return RABBITMQ_URL_DEFAULT;
};

export const assertRmqCredentialsForProduction = (
  url: string,
  nodeEnv: string | undefined = process.env.NODE_ENV
): void => {
  if (nodeEnv !== "production") {
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(amqpToHttp(url));
  } catch {
    throw new Error("RMQ config error: invalid RABBITMQ_URL");
  }

  // WHATWG URL already percent-decodes userinfo — do not decodeURIComponent again
  const username = parsed.username;
  const password = parsed.password;

  if (!username || !password) {
    throw new Error(
      "RMQ config error: production requires credentials in RABBITMQ_URL or RABBITMQ_USER/PASS"
    );
  }

  if (username === "guest") {
    throw new Error(
      'RMQ config error: production forbids RabbitMQ user "guest"'
    );
  }

  if (username === RABBITMQ_DX_USER && password === RABBITMQ_DX_PASS) {
    throw new Error(
      "RMQ config error: production forbids DX RabbitMQ credentials (mp / mp_dev_change_me)"
    );
  }
};

const getRmqConfig = (config: ConfigService, queueKey: string) => {
  // пустая строка из compose/env = unset
  const configuredUrl = (config.get<string>("RABBITMQ_URL") || "").trim();
  const user = config.get<string>("RABBITMQ_USER") || undefined;
  const pass = config.get<string>("RABBITMQ_PASS") || undefined;
  const host = config.get<string>("RABBITMQ_HOST") || undefined;
  const nodeEnv = config.get<string>("NODE_ENV") || process.env.NODE_ENV;

  const url = resolveRmqUrl({
    url: selectRmqUrlOrDxDefault({ configuredUrl, user, pass, nodeEnv }),
    user,
    pass,
    host,
  });

  assertRmqCredentialsForProduction(url, nodeEnv);

  const queue = config.get<string>(queueKey) || QUEUE_DEFAULTS[queueKey];

  if (!queue) {
    throw new Error(`RMQ config error: ${queueKey}`);
  }

  return { url, queue };
};

export const createRmqClient = (
  config: ConfigService,
  queueKey: string
) => {
  const { url, queue } = getRmqConfig(config, queueKey);

  return ClientProxyFactory.create({
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: {
        durable: true,
      },
    },
  });
};

export const createRmqMicroserviceOptions = (
  config: ConfigService,
  queueKey: string
): MicroserviceOptions => {
  const { url, queue } = getRmqConfig(config, queueKey);

  return {
    transport: Transport.RMQ,
    options: {
      urls: [url],
      queue,
      queueOptions: {
        durable: true,
      },
    },
  };
};
