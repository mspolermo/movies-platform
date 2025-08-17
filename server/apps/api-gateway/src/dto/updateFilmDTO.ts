import { IsIn, IsString } from 'class-validator';
import {
  MUST_BE_STRING_ERROR,
  WRONG_FILM_NAME_EN_ERROR,
  WRONG_FILM_NAME_RU_ERROR,
} from '../app.constants';

export class UpdateFilmDTO {
  @IsString({ message: MUST_BE_STRING_ERROR })
  @IsIn(['ru'], { message: WRONG_FILM_NAME_RU_ERROR })
  filmNameRu: string;
  @IsString({ message: MUST_BE_STRING_ERROR })
  @IsIn(['en'], { message: WRONG_FILM_NAME_EN_ERROR })
  filmNameEn: string;
}
