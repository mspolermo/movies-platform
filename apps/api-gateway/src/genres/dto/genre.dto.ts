import { IsString } from "class-validator";
import { MUST_BE_STRING_ERROR } from "../../shared/constants/errors.constants";
import { TGenreCreationAtt } from "@common/types";

/**
 * DTO для создания/обновления жанра
 * Наследует от общего типа GenreCreationAtt
 */
export class GenreDTO implements TGenreCreationAtt {
  @IsString({ message: MUST_BE_STRING_ERROR })
  nameRu: string;
  
  @IsString({ message: MUST_BE_STRING_ERROR })
  nameEn: string;

}
