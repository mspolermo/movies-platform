import { IsString } from 'class-validator';
import { MUST_BE_STRING_ERROR } from '../constants/errors';

export class GenreDTO {
  @IsString({ message: MUST_BE_STRING_ERROR })
  nameRu: string;
  @IsString({ message: MUST_BE_STRING_ERROR })
  nameEn: string;
}
