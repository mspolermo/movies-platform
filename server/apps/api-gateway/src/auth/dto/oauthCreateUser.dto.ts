import { IsEmail, IsString } from 'class-validator';
import {
  MUST_BE_STRING_ERROR,
  WRONG_EMAIL_ERROR,
} from '../../shared/constants/errors.constants';

export class OauthCreateUserDTO {
  @IsString({ message: MUST_BE_STRING_ERROR })
  @IsEmail({}, { message: WRONG_EMAIL_ERROR })
  readonly email: string;
}
