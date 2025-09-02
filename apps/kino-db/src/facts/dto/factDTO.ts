import { TFactDTO } from "@common";

export class FactDTO implements TFactDTO {
  value: string;
  type: string;
  spoiler: boolean;
}
