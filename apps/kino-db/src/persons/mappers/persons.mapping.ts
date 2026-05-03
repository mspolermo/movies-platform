import type { Film } from "../../films/films.model";
import type { Person } from "../models";
import type {
  TPersonFilmResponse,
  TPersonListItemResponse,
  TPersonProfileResponse,
} from "@common/types";

export function mapPersonToListItem(person: Person): TPersonListItemResponse {
  const data = (
    typeof person.toJSON === "function" ? person.toJSON() : person
  ) as TPersonListItemResponse;

  return {
    id: data.id,
    photoUrl: data.photoUrl,
    nameRu: data.nameRu,
    nameEn: data.nameEn,
  };
}

export function mapPersonToProfile(person: Person): TPersonProfileResponse {
  return person.get({ plain: true }) as TPersonProfileResponse;
}

export function mapFilmToPersonFilm(film: Film): TPersonFilmResponse {
  const data = (
    typeof film.toJSON === "function" ? film.toJSON() : film
  ) as TPersonFilmResponse;

  return {
    id: data.id,
    smallPictureUrl: data.smallPictureUrl,
    filmNameRu: data.filmNameRu,
    filmNameEn: data.filmNameEn,
    year: data.year,
    ratingKp: data.ratingKp,
  };
}
