import type {
  TAuthResponse,
  TCurrentUserResponse,
  TRegistrationResponse,
} from "@common/types";

import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  Res,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Throttle, ThrottlerGuard } from "@nestjs/throttler";
import { Request, Response } from "express";

import { AuthDto, CreateUserDto } from "@common/dto";

import {
  JwtAuthGuard,
  OriginGuard,
  Public,
} from "../../shared/guards";
import { AuthenticatedRequest } from "../../shared/interfaces";
import { ValidationPipe } from "../../shared/pipes";
import {
  clearAuthCookies,
  REFRESH_TOKEN_COOKIE,
  setAuthCookies,
} from "../helpers";
import { AuthService } from "../services";

/** HTTP-граница auth: cookie, throttle, OriginGuard на refresh/logout. */
@UseGuards(ThrottlerGuard)
@Controller("auth")
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {}

  private isProduction(): boolean {
    return (
      this.configService.get<string>("NODE_ENV", "development") === "production"
    );
  }

  @Public()
  @Throttle(5, 60)
  @ApiOperation({ summary: "Регистрация" })
  @ApiResponse({ status: 200, description: "Пользователь зарегистрирован" })
  @UsePipes(ValidationPipe)
  @Post("/registration")
  async registrationUser(
    @Body() dto: CreateUserDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<TRegistrationResponse> {
    const { body, refreshToken } = await this.authService.registrationUser(dto);
    setAuthCookies(res, refreshToken, this.isProduction());
    return body;
  }

  @Public()
  @Throttle(5, 60)
  @ApiOperation({ summary: "Логин" })
  @ApiResponse({ status: 200, description: "Пользователь авторизован" })
  @UsePipes(ValidationPipe)
  @Post("/login")
  async loginUser(
    @Body() dto: AuthDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<TAuthResponse> {
    const { body, refreshToken } = await this.authService.loginUser(dto);
    setAuthCookies(res, refreshToken, this.isProduction());
    return body;
  }

  @Public()
  @UseGuards(OriginGuard)
  @Throttle(30, 60)
  @ApiOperation({ summary: "Обновление access token по refresh cookie" })
  @ApiResponse({ status: 200, description: "Новая пара токенов" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @Post("/refresh")
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<TAuthResponse> {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as
      | string
      | undefined;
    const { body, refreshToken: newRefreshToken } =
      await this.authService.refreshByCookie(refreshToken ?? "");
    setAuthCookies(res, newRefreshToken, this.isProduction());
    return body;
  }

  @Public()
  @UseGuards(OriginGuard)
  @ApiOperation({ summary: "Выход из системы" })
  @ApiResponse({ status: 200, description: "Сессия завершена" })
  @Post("/logout")
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ): Promise<{ success: true }> {
    const refreshToken = req.cookies?.[REFRESH_TOKEN_COOKIE] as
      | string
      | undefined;
    await this.authService.logoutByCookie(refreshToken);
    clearAuthCookies(res, this.isProduction());
    return { success: true };
  }

  @ApiOperation({ summary: "Текущий пользователь" })
  @ApiResponse({ status: 200, description: "Информация о пользователе" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Get("/me")
  async getCurrentUser(
    @Req() req: AuthenticatedRequest
  ): Promise<TCurrentUserResponse> {
    return await this.authService.getCurrentUser(req.user);
  }

  /** @deprecated Используйте GET /auth/me */
  @ApiOperation({ summary: "Получение пользователя по токену (deprecated)" })
  @ApiResponse({ status: 200, description: "Информация о пользователе" })
  @ApiResponse({ status: 401, description: "Unauthorized" })
  @UseGuards(JwtAuthGuard)
  @Get("/checkToken")
  async checkToken(@Req() req: AuthenticatedRequest) {
    return {
      id: req.user.id,
      email: req.user.email,
    };
  }
}
