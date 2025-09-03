import { IsString, IsNumber, IsOptional } from "class-validator";

export class CommentDTO {
  @IsString({ message: "Заголовок должен быть строкой" })
  header: string;

  @IsString({ message: "Текст комментария должен быть строкой" })
  value: string;

  @IsString({ message: "Никнейм должен быть строкой" })
  nickName: string;

  @IsOptional()
  @IsNumber({}, { message: "ID родительского комментария должен быть числом" })
  parentId?: number;
}
