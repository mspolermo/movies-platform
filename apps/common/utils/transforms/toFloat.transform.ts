import { Transform } from "class-transformer";

export function ToFloat(defaultValue?: number) {
  return Transform(({ value }) => {
    const parsed = parseFloat(value);

    if (Number.isNaN(parsed)) {
      return defaultValue;
    }

    return parsed;
  });
}