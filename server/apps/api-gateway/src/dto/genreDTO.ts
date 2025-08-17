import { IsString } from 'class-validator';
import { MUST_BE_STRING_ERROR } from '../app.constants';

export class GenreDTO {
  @IsString({ message: MUST_BE_STRING_ERROR })
  nameRu: string;
  @IsString({ message: MUST_BE_STRING_ERROR })
  nameEn: string;
}
