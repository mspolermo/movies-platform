import { ApiProperty } from "@nestjs/swagger";

export class CountryResponseDto {
  @ApiProperty({
    example: 1,
    description: "Уникальный идентификатор страны",
  })
  id!: number;

  @ApiProperty({
    example: "Россия",
    description: "Название страны",
  })
  name!: string;
}