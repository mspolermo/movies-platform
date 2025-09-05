import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationException extends HttpException {
  messages: string | string[] | Record<string, string[]>;

  constructor(response: string | string[] | Record<string, string[]>) {
    super(response, HttpStatus.BAD_REQUEST);
    this.messages = response;
  }
}
