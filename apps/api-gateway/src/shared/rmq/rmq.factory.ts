import { ConfigService } from "@nestjs/config";
import { ClientProxyFactory, MicroserviceOptions, Transport } from "@nestjs/microservices";

//TODO: вытащить в common!!!

const getRmqConfig = (config: ConfigService, queueKey: string) => {
  const url = config.get<string>("RABBITMQ_URL");
  const queue = config.get<string>(queueKey);

  if (!url || !queue) {
    throw new Error(`RMQ config error: ${queueKey}`);
  }

  return { url, queue };
};

export const createRmqClient = (
  config: ConfigService,
  queueKey: string,
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
  queueKey: string,
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
