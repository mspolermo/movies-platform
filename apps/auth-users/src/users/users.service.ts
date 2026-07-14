import type { TAuthorizedUserResponse } from "@common/types";

import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import * as bcrypt from "bcryptjs";

import { AuthDto, CreateUserDto, OauthCreateUserDto } from "@common/dto";

import { BCRYPT_ROUNDS } from "../config/jwt.config";
import { RolesService } from "../roles/roles.service";
import { TokensService } from "../tokens/tokens.service";

import { toAuthorizedUserResponse } from "./users.mapper";
import { User } from "./users.model";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private tokensService: TokensService
  ) {}

  async login(dto: AuthDto) {
    const user = await this.validateUser(dto);
    return this.tokensService.createTokenPair(user);
  }

  async createUser(dto: CreateUserDto) {
    const candidate = await this.userRepository.findOne({
      where: { email: dto.email },
      include: { all: true },
    });
    if (candidate) {
      throw new HttpException(
        "Пользователь с таким email уже зарегистрирован",
        HttpStatus.BAD_REQUEST
      );
    }
    return this.createUserWithRole(dto, "USER");
  }

  //TODO: зачем это вообще
  async oauthCreateUser(dto: OauthCreateUserDto): Promise<never> {
    console.log(dto);
    throw new HttpException(
      "OAuth registration is not implemented",
      HttpStatus.NOT_IMPLEMENTED
    );
  }

  async createUserWithRole(dto: CreateUserDto, roleName: string) {
    const hashPassword = await bcrypt.hash(
      dto.password,
      BCRYPT_ROUNDS
    );
    const user = await this.userRepository.create({
      ...dto,
      password: hashPassword,
    });
    const role = await this.roleService.getRoleByValue(roleName);
    if (!role) {
      throw new Error(`Role ${roleName} not found`);
    }
    await user.$set("roles", [role.id]);
    user.roles = [role];
    return this.tokensService.createTokenPair(user);
  }

  async validateUser(dto: AuthDto) {
    try {
      const user = await this.userRepository.findOne({
        where: { email: dto.email },
        include: { all: true },
      });
      if (!user) {
        throw new UnauthorizedException({
          message: "Пользователь с таким email не найден",
        });
      }
      const passwordEquals = await bcrypt.compare(dto.password, user.password);
      if (!passwordEquals) {
        throw new UnauthorizedException({
          message: "Неверный пароль",
        });
      }
      return user;
    } catch (e) {
      if (e instanceof UnauthorizedException) {
        throw e;
      }
      throw new UnauthorizedException({
        message: "Ошибка при валидации пользователя",
      });
    }
  }

  async getUserById(userId: number): Promise<TAuthorizedUserResponse> {
    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        include: { all: true },
      });
      if (!user) {
        throw new HttpException("Пользователь не найден", HttpStatus.NOT_FOUND);
      }
      return toAuthorizedUserResponse(user);
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new HttpException(
        "Ошибка при получении пользователя",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
