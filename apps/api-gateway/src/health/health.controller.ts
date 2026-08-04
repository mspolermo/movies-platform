import type { Response } from "express";

import { Controller, Get, HttpStatus, Res } from "@nestjs/common";

import { Public } from "../shared/guards";

import { HealthService } from "./health.service";

@Controller()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Public()
  @Get("/health/live")
  live() {
    return this.healthService.live();
  }

  @Public()
  @Get("/health")
  async ready(@Res({ passthrough: true }) res: Response) {
    const { body, httpStatus } = await this.healthService.ready();

    if (httpStatus !== HttpStatus.OK) {
      res.status(httpStatus);
    }

    return body;
  }
}
