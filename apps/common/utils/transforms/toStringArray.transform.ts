import { Transform } from "class-transformer";

export function ToStringArray() {
  return Transform(({ value }) => {
    if (typeof value === "string") {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }

    return value;
  });
}