import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

export class PersonIdParamDto {
  @ApiProperty({
    description: "ID персоны",
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  id!: number;
}
