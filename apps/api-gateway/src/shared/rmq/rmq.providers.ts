import { Provider } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { createRmqClient } from "./rmq.factory";
import { FILMS_CLIENT, USERS_CLIENT } from "./rmq.tokens";

export const rmqProviders: Provider[] = [
  {
    provide: FILMS_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
      createRmqClient(config, "FILMS_QUEUE"),
  },
  {
    provide: USERS_CLIENT,
    inject: [ConfigService],
    useFactory: (config: ConfigService) =>
      createRmqClient(config, "USERS_QUEUE"),
  },
];