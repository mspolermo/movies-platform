import { RpcException } from "@nestjs/microservices";

/**
 * Проверяет RPC ID: целое число больше или равно 1.
 * Бросает RpcException (400) при некорректном значении.
 */
export function assertRpcPositiveInt(value: number, field: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RpcException({
      statusCode: 400,
      message: `Некорректный ${field}`,
    });
  }
}
