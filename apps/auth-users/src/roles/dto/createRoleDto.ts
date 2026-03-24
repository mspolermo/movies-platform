import type { TRoleCreationAtt } from "@common/types/orm";

import { IsString, IsOptional } from "class-validator";

export class CreateRoleDto implements TRoleCreationAtt {
  @IsString({ message: "Должно быть строкой" })
  readonly value!: string;

  @IsOptional()
  @IsString({ message: "Должно быть строкой" })
  readonly description?: string;
}
