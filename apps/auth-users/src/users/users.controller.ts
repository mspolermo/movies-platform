import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";

import { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";
import { authUsersRpc } from "@common/services";

import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
}
