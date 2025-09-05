import { IsString, IsIn } from "class-validator";

/**
 * DTO для обновления фильма
 */
export class UpdateFilmDto {
  @IsString({ message: "Название фильма на русском должно быть строкой" })
  @IsIn(["ru"], { message: "Некорректное название фильма на русском" })
  filmNameRu: string;
  
  @IsString({ message: "Название фильма на английском должно быть строкой" })
  @IsIn(["en"], { message: "Некорректное название фильма на английском" })
  filmNameEn: string;
}
