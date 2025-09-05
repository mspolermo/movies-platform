import { IsString } from "class-validator";
import { TGenreCreationAtt } from "@common/types";

/**
 * DTO для создания/обновления жанра
 * Наследует от общего типа GenreCreationAtt
 */
export class GenreDto implements TGenreCreationAtt {
  @IsString({ message: "Название на русском должно быть строкой" })
  nameRu: string;
  
  @IsString({ message: "Название на английском должно быть строкой" })
  nameEn: string;
}
