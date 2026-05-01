import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsInt, Min } from "class-validator";

export class FindPersonsQueryDto {
  @ApiPropertyOptional({
    description: "Имя человека",
    example: "Tom",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    description: "ID профессии",
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  professionId?: number;
}