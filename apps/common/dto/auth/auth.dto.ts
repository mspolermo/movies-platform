import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Length, IsOptional } from "class-validator";

/**
 * Базовый DTO для аутентификации
 */
export class AuthDto {
  @IsString({ message: "Email должен быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email!: string;

  @IsString({ message: "Пароль должен быть строкой" })
  @Length(6, 16, { message: "Пароль должен быть от 6 до 16 символов" })
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
  @Length(6, 16, { message: "Пароль должен быть от 6 до 16 символов" })
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
