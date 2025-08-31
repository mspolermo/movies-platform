import { TPersonCreationAtt } from "@common/types";
import { ProfessionDTO } from "../../professions/dto/professionDTO";

export class PersonDTO implements TPersonCreationAtt {
  photoUrl: string;
  nameRu: string;
  nameEn: string;
  professions: ProfessionDTO[];
}
