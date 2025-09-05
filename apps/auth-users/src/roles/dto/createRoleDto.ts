import { IsString, IsOptional } from "class-validator";
import { TRoleCreationAtt } from "@common/types";

export class CreateRoleDto implements TRoleCreationAtt {
  @IsString({ message: "Должно быть строкой" })
  readonly value: string;

  @IsOptional()
  @IsString({ message: "Должно быть строкой" })
  readonly description?: string;
}
