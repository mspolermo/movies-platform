import { Transform } from "class-transformer";

export function ToInt(defaultValue?: number) {
  return Transform(({ value }) => {
    const parsed = parseInt(value, 10);

    if (Number.isNaN(parsed)) {
      return defaultValue;
    }

    return parsed;
  });
}