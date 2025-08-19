import { IsEmail, IsString, Length } from 'class-validator';
import {
  MUST_BE_STRING_ERROR,
  STRING_LENGTH_ERROR,
  WRONG_EMAIL_ERROR,
} from '../constants/errors';

export class AuthDto {
  @IsString({ message: MUST_BE_STRING_ERROR })
  @IsEmail({}, { message: WRONG_EMAIL_ERROR })
  readonly email: string;

  @IsString({ message: MUST_BE_STRING_ERROR })
  @Length(4, 16, { message: STRING_LENGTH_ERROR })
  readonly password: string;
}
