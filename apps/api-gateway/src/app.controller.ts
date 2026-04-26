import { Controller, Get } from "@nestjs/common";

import { AuthService } from "./auth";
import { FilmsService } from "./films";
import { PersonsService } from "./persons";
import { Public } from "./shared/guards";

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly filmsService: FilmsService,
    private readonly personsService: PersonsService
  ) {}

  @Public()
  @Get("/health")
  async health() {
    const [users, films, persons] = await Promise.allSettled([
      this.authService.ping(),
      this.filmsService.ping(),
      this.personsService.ping(),
    ]);

    return {
      status: "ok",
      timestamp: new Date().toISOString(),
      service: "api-gateway",
      rabbitmq: {
        users: this.map(users),
        films: this.map(films),
        persons: this.map(persons),
      },
    };
  }

  private map(result: PromiseSettledResult<unknown>) {
    return result.status === "fulfilled" ? "connected" : "disconnected";
  }
}