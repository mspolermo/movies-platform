import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Person } from "../persons/persons.model";
import { Film } from "./films.model";
import { Country } from "../countries/countries.model";
import { Genre } from "../genres/genres.model";
import { UpdateFilmDto } from "@common/dto";
import { Profession } from "../professions/professions.model";
import { Fact } from "../facts/facts.model";
import { Op, Sequelize } from "sequelize";
import {
  TFilmCardResponse,
  TFilmDetailsResponse,
  TFilmFiltersListPayload,
  TPaginatedPersonsResponse,
  TProfessionBased,
} from "@common/types";

const FILM_CARD_ATTRIBUTES = [
  "id",
  "filmNameRu",
  "filmNameEn",
  "bigPictureUrl",
  "smallPictureUrl",
  "ratingKp",
  "year",
  "premiereCountry",
  "movieLength",
] as const;

const pickFilmCardResponse = (film: Film): TFilmCardResponse => {
  const filmData = (
    typeof film.toJSON === "function" ? film.toJSON() : film
  ) as TFilmCardResponse;

  return {
    id: filmData.id,
    filmNameRu: filmData.filmNameRu,
    filmNameEn: filmData.filmNameEn,
    bigPictureUrl: filmData.bigPictureUrl,
    smallPictureUrl: filmData.smallPictureUrl,
    ratingKp: filmData.ratingKp,
    year: filmData.year,
    premiereCountry: filmData.premiereCountry,
    movieLength: filmData.movieLength,
  };
};

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film) private filmRepository: typeof Film) {}

  async getFilmById(id: number): Promise<TFilmDetailsResponse | null> {
    const film = await this.filmRepository.findByPk(id, {
      attributes: [
        "id",
        "trailerUrl",
        "ratingKp",
        "votesKp",
        "movieLength",
        "filmNameRu",
        "filmNameEn",
        "description",
        "slogan",
        "bigPictureUrl",
        "smallPictureUrl",
        "year",
      ],
      include: [
        {
          model: Country,
          as: "countries",
          attributes: ['countryName', 'countryNameEn'],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ['nameRu', 'nameEn'],
          through: { attributes: [] },
        },
        {
          model: Fact,
          as: "fact",
          attributes: ['value', 'spoiler'],
        },
      ],
    });

    if (!film) {
      return null;
    }

    return film.toJSON();
  }

  async updateFilm(id: number, dto: UpdateFilmDto) {
    const film = await this.filmRepository.findByPk(id);
    if (!film) {
      throw new Error(`Film with id ${id} not found`);
    }

    await this.filmRepository.update(
      { filmNameEn: dto.filmNameEn, filmNameRu: dto.filmNameRu },
      { where: { id } }
    );

    return film;
  }

  async getAllFilms(): Promise<Film[]> {
    const films = await this.filmRepository.findAll();
    return films;
  }

  async deleteFilm(id: number) {
    const film = await this.filmRepository.findByPk(id);
    if (!film) {
      throw new Error(`Film with id ${id} not found`);
    }
    await this.filmRepository.destroy({ where: { id: id } });
  }

  async getFilmByName(name: string) {
    const film = await this.filmRepository.findOne({
      where: {
        [Op.or]: [{ filmNameRu: name }, { filmNameEn: name }],
      },
    });

    if (!film) {
      throw new Error(`Film with name ${name} not found`);
    }

    return film;
  }

  async searchFilmsByName(name: string): Promise<TFilmCardResponse[]> {
    const films = await this.filmRepository.findAll({
      attributes: FILM_CARD_ATTRIBUTES as unknown as string[],
      where: {
        [Op.or]: [
          { filmNameRu: { [Op.iLike]: `%${name}%` } },
          { filmNameEn: { [Op.iLike]: `%${name}%` } },
        ],
      },
      limit: 10,
      order: [["votesKp", "DESC"]],
    });

    return films;
  }

  async filmFilters(
    page: number,
    perPage: number,
    genres?: string[],
    countries?: string[],
    persons?: string[],
    minRatingKp = 0,
    minVotesKp = 0,
    sortBy?: string,
    year?: number
  ): Promise<TFilmFiltersListPayload> {
    const order: [string, string] =
      sortBy === "rating"
        ? ["ratingKp", "DESC"]
        : sortBy === "novelty"
          ? ["premiereWorldDate", "DESC"]
          : sortBy === "alphabet"
            ? ["filmNameRu", "ASC"]
            : ["votesKp", "DESC"];
    const attributes = Array.from(
      new Set([...FILM_CARD_ATTRIBUTES, order[0]])
    ) as string[];
    const include: Array<{
      model: typeof Genre | typeof Country | typeof Person;
      as?: string;
      attributes?: string[];
      through?: { attributes: [] };
      required?: boolean;
      where?: {
        [Op.or]?: Array<{ nameRu?: string[]; nameEn?: string[]; countryName?: string[] }>;
        countryName?: string[];
      };
    }> = [];
    if (genres) {
      include.push({
        model: Genre,
        as: "genres",
        attributes: [],
        through: { attributes: [] },
        required: true,
        where: {
          [Op.or]: [{ nameRu: genres }, { nameEn: genres }],
        },
      });
    }
    if (countries)
      include.push({
        model: Country,
        as: "countries",
        attributes: [],
        through: { attributes: [] },
        required: true,
        where: { countryName: countries },
      });

    if (persons)
      include.push({
        model: Person,
        as: "persons",
        attributes: [],
        through: { attributes: [] },
        required: true,
        where: {
          [Op.or]: [{ nameRu: persons }, { nameEn: persons }],
        },
      });

    const where: {
      ratingKp?: { [Op.gte]: number };
      votesKp?: { [Op.gte]: number };
      year?: number;
    } = {
      ratingKp: { [Op.gte]: minRatingKp },
      votesKp: { [Op.gte]: minVotesKp },
    };
    if (year) {
      where.year = year;
    }

    const { rows, count } = await this.filmRepository.findAndCountAll({
      attributes,
      include,
      where,
      limit: perPage,
      offset: (page - 1) * perPage,
      order: [order],
      distinct: true,
      col: "id",
    });
    const films = rows.map((film) => pickFilmCardResponse(film));
    const total = Array.isArray(count) ? count.length : count;
    return { films, total };
  }

  async getAllFilmYears(): Promise<number[]> {
    const years = await this.filmRepository.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("year")), "year"]],
      order: [[Sequelize.col("year"), "ASC"]],
    });

    return years.map((year) => year.year);
  }

  async getFilmProfessions(filmId: number): Promise<TProfessionBased[]> {
    const film = await this.filmRepository.findByPk(filmId, {
      include: [
        {
          model: Person,
          as: "persons",
          attributes: ['id'],
          through: { attributes: [] },
          include: [
            {
              model: Profession,
              as: "professions",
              attributes: ['id', 'name'],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!film) {
      return [];
    }

    // Собираем уникальные профессии
    const professionsMap = new Map<number, TProfessionBased>();
    
    if (film.persons) {
      for (const person of film.persons) {
        if (person.professions && person.professions.length > 0) {
          for (const profession of person.professions) {
            if (!professionsMap.has(profession.id)) {
              professionsMap.set(profession.id, {
                id: profession.id,
                name: profession.name,
              });
            }
          }
        }
      }
    }

    return Array.from(professionsMap.values());
  }

  async getFilmPersonsByProfession(
    filmId: number,
    professionName: string,
    page: number = 1,
    limit: number = 20
  ): Promise<TPaginatedPersonsResponse> {
    const normalizedLimit = limit > 0 && limit <= 100 ? limit : 20;
    const normalizedPage = page > 0 ? page : 1;
    const normalizedOffset = (normalizedPage - 1) * normalizedLimit;

    const film = await this.filmRepository.findByPk(filmId, {
      include: [
        {
          model: Person,
          as: "persons",
          attributes: ['id', 'photoUrl', 'nameRu', 'nameEn'],
          through: { attributes: [] },
          include: [
            {
              model: Profession,
              as: "professions",
              attributes: ['id', 'name'],
              through: { attributes: [] },
              where: { name: professionName },
            },
          ],
        },
      ],
    });

    if (!film) {
      return {
        items: [],
        total: 0,
        hasMore: false,
      };
    }

    // Фильтруем персон с нужной профессией
    const personsWithProfession = (film.persons || []).filter(
      (person) => person.professions && person.professions.length > 0
    );

    const total = personsWithProfession.length;
    const paginatedPersons = personsWithProfession.slice(
      normalizedOffset,
      normalizedOffset + normalizedLimit
    );

    const hasMore = normalizedOffset + paginatedPersons.length < total;

    return {
      items: paginatedPersons,
      total,
      hasMore,
    };
  }
}
