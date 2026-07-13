import { IsString } from "class-validator";

export class CommentDTO {
  @IsString({ message: "Заголовок должен быть строкой" })
  title!: string;

  @IsString({ message: "Текст комментария должен быть строкой" })
  text!: string;
}
