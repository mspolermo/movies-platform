import type { Response } from "express";

import { Controller, Get, HttpStatus, Res, UseGuards } from "@nestjs/common";

import { JwtAuthGuard, Public } from "../shared";

import { HealthService } from "./health.service";

@Controller()
@UseGuards(JwtAuthGuard)
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
