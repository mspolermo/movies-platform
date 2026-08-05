import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class ProfessionPersonsParamDto {
  @ApiProperty({ description: "ID профессии", example: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  professionId!: number;
}
