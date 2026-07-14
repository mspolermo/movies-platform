import type {
  TAuthUsersRpcLogoutRequest,
  TAuthUsersRpcRefreshRequest,
} from "@common/types";

import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";
import { authUsersRpc } from "@common/services";

import { TokensService } from "../tokens/tokens.service";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService
  ) {}

  @MessagePattern(authUsersRpc.users.registration)
  async registration(@Payload() dto: CreateUserDto) {
    return await this.usersService.createUser(dto);
  }

  @MessagePattern(authUsersRpc.users.outRegistration)
  async outRegistration(@Payload() dto: OauthCreateUserDto) {
    return await this.usersService.oauthCreateUser(dto);
  }

  @MessagePattern(authUsersRpc.users.login)
  async login(@Payload() dto: AuthDto) {
    return await this.usersService.login(dto);
  }

  @MessagePattern(authUsersRpc.users.getById)
  async getUserById(@Payload() userId: number) {
    return await this.usersService.getUserById(userId);
  }

  @MessagePattern(authUsersRpc.users.refresh)
  async refresh(@Payload() dto: TAuthUsersRpcRefreshRequest) {
    return await this.tokensService.refresh(dto.refreshToken);
  }

  @MessagePattern(authUsersRpc.users.logout)
  async logout(@Payload() dto: TAuthUsersRpcLogoutRequest) {
    await this.tokensService.revoke(dto.refreshToken);
    return true;
  }
}
