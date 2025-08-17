import { IsString } from 'class-validator';
import { MUST_BE_STRING_ERROR } from '../app.constants';

export class CommentDTO {
  @IsString({ message: MUST_BE_STRING_ERROR })
  header: string;
  @IsString({ message: MUST_BE_STRING_ERROR })
  value: string;
  parentId: number;
}
