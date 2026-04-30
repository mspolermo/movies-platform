import type { TAuthUsersRpcContract, TKinoDbRpcContract } from "./messaging";

import { Inject, Injectable } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";

import { FILMS_CLIENT, USERS_CLIENT } from "./rmq.tokens";

@Injectable()
export class RmqService {
  constructor(
    @Inject(FILMS_CLIENT) private readonly filmsClient: ClientProxy,
    @Inject(USERS_CLIENT) private readonly usersClient: ClientProxy,
  ) {}

  sendToFilms<TPattern extends keyof TKinoDbRpcContract>(
    pattern: TPattern,
    data: TKinoDbRpcContract[TPattern]["request"]
  ): Promise<TKinoDbRpcContract[TPattern]["response"]> {
    return firstValueFrom(
      this.filmsClient.send<TKinoDbRpcContract[TPattern]["response"]>(pattern, data)
    );
  }

  sendToUsers<TPattern extends keyof TAuthUsersRpcContract>(
    pattern: TPattern,
    data: TAuthUsersRpcContract[TPattern]["request"]
  ): Promise<TAuthUsersRpcContract[TPattern]["response"]> {
    return firstValueFrom(
      this.usersClient.send<TAuthUsersRpcContract[TPattern]["response"]>(pattern, data)
    );
  }
}