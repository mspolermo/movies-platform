import { IsEmail, IsString, Length, IsOptional } from "class-validator";
import { TUserCreationAtt } from "@common/types";

export class CreateUserDto implements TUserCreationAtt {
  @IsString({ message: "Должно быть строкой" })
  @IsEmail({}, { message: "Некорректный email" })
  readonly email: string;
  
  @IsString({ message: "Должно быть строкой" })
  @Length(4, 16, { message: "Не меньше 4 и не больше 16" })
  readonly password: string;

  @IsOptional()
  @IsString({ message: "Должно быть строкой" })
  readonly name?: string;
}
