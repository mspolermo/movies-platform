import { IsEmail, IsString, Length, MinLength, IsOptional } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

/**
 * Базовый DTO для аутентификации
 */
export class AuthDto {
  @IsString({ message: "Email должен быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email!: string;

  @IsString({ message: "Пароль должен быть строкой" })
  @Length(4, 16, { message: "Пароль должен быть от 4 до 16 символов" })
  readonly password!: string;
}

/**
 * DTO для создания пользователя
 */
export class CreateUserDto {
  @ApiProperty({
    example: "user@example.com",
    description: "Email пользователя",
  })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email!: string;

  @ApiProperty({ example: "123456", description: "Пароль пользователя" })
  @IsString({ message: "Пароль должен быть строкой" })
  @MinLength(6, { message: "Пароль должен быть не менее 6 символов" })
  readonly password!: string;

  @IsOptional()
  @IsString({ message: "Имя должно быть строкой" })
  readonly name?: string;
}

/**
 * DTO для OAuth создания пользователя
 */
export class OauthCreateUserDto {
  @IsString({ message: "Email должен быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email!: string;
}
