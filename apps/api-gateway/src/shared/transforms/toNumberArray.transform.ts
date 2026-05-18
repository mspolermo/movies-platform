import { Transform } from "class-transformer";

export function ToNumberArray() {
  return Transform(({ value }) => {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => parseInt(item.trim(), 10))
        .filter((n) => !Number.isNaN(n));
    }

    if (Array.isArray(value)) {
      return value
        .map((v) =>
          typeof v === "string"
            ? parseInt(v, 10)
            : v
        )
        .filter((n) => !Number.isNaN(n));
    }

    return value;
  });
}