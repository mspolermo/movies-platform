import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  ParseIntPipe,
  PipeTransform,
} from "@nestjs/common";

/** Преобразует параметр в положительное целое число. */
@Injectable()
export class ParsePositiveIntPipe
  extends ParseIntPipe
  implements PipeTransform<string>
{
  async transform(value: string, metadata: ArgumentMetadata): Promise<number> {
    const parsed = await super.transform(value, metadata);

    if (parsed < 1) {
      throw new BadRequestException(
        `Validation failed (${metadata.data ?? "param"} must be >= 1)`
      );
    }

    return parsed;
  }
}
