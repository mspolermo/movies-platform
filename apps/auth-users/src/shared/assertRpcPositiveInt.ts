import { RpcException } from "@nestjs/microservices";

/** RPC defense-in-depth: целое id >= 1. */
export function assertRpcPositiveInt(value: number, field: string): void {
  if (!Number.isInteger(value) || value < 1) {
    throw new RpcException({
      statusCode: 400,
      message: `Некорректный ${field}`,
    });
  }
}
