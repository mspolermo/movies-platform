import { ValidateIf } from "class-validator";

/**
 * Поле опционально в PATCH; `null` допустим и означает «очистить» (ADR-007).
 * Валидаторы типа применяются только к реальному значению.
 */
export const OptionalNullable = (): PropertyDecorator =>
  ValidateIf((_object, value) => value !== undefined && value !== null);

/**
 * Поле опционально (можно не присылать), но `null` запрещён —
 * его отвергнут валидаторы типа (для NOT NULL колонок).
 */
export const OptionalStrict = (): PropertyDecorator =>
  ValidateIf((_object, value) => value !== undefined);
