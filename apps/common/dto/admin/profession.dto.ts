import type {
  TCreateProfessionRequest,
  TUpdateProfessionRequest,
} from "@common/types";

import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { OptionalStrict } from "./decorators";

export class CreateProfessionDto implements TCreateProfessionRequest {
  @ApiProperty({ description: "Название профессии" })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateProfessionDto implements TUpdateProfessionRequest {
  @ApiPropertyOptional({ description: "Название профессии" })
  @OptionalStrict()
  @IsString()
  @IsNotEmpty()
  name?: string;
}
