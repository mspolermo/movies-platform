import { HttpStatus } from "@nestjs/common";
import { RpcException } from "@nestjs/microservices";
import { UniqueConstraintError } from "sequelize";

/**
 * Гонка check-then-create: unique-индекс модели ловит дубликат → 409.
 * Прочие ошибки пробрасывает как есть.
 */
export function rethrowUniqueAsConflict(
  error: unknown,
  message: string
): never {
  if (error instanceof UniqueConstraintError) {
    throw new RpcException({
      statusCode: HttpStatus.CONFLICT,
      message,
    });
  }

  throw error;
}
