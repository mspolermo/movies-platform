import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { UsersService } from "./users.service";
import { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @MessagePattern("registration")
  async registration(@Payload() dto: CreateUserDto) {
    return await this.usersService.createUser(dto);
  }

  @MessagePattern("outRegistration")
  async outRegistration(@Payload() dto: OauthCreateUserDto) {
    return await this.usersService.oauthCreateUser(dto);
  }

  @MessagePattern("login")
  async login(@Payload() dto: AuthDto) {
    return await this.usersService.login(dto);
  }

  @MessagePattern("getUserById")
  async getUserById(@Payload() userId: number) {
    return await this.usersService.getUserById(userId);
  }
}
