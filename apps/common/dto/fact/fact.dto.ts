import { IsString, IsBoolean } from "class-validator";

/**
 * DTO для факта
 */
export class FactDto {
  @IsString({ message: "Значение факта должно быть строкой" })
  value: string;
  
  @IsString({ message: "Тип факта должен быть строкой" })
  type: string;
  
  @IsBoolean({ message: "Поле спойлера должно быть булевым" })
  spoiler: boolean;
}
