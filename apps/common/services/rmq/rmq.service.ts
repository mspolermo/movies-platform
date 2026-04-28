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

  sendToFilms<T>(pattern: string, data: unknown): Promise<T> {
    return firstValueFrom(this.filmsClient.send<T>(pattern, data));
  }

  sendToUsers<T>(pattern: string, data: unknown): Promise<T> {
    return firstValueFrom(this.usersClient.send<T>(pattern, data));
  }
}