import { Type } from "class-transformer";
import { IsInt, Min } from "class-validator";

import { GetPersonsDto } from "./getPersons.dto";

export class GetPersonsByProfessionDto extends GetPersonsDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  professionId!: number;
}