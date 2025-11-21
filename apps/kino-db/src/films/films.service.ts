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
import { TProfessionWithPersons, TPersonBased } from "@common/types";

@Injectable()
export class FilmsService {
  constructor(@InjectModel(Film) private filmRepository: typeof Film) {}

  async getFilmById(id: number) {
    const film = await this.filmRepository.findByPk(id, {
      attributes: {
        exclude: ['createdAt'],
      },
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
            },
          ],
        },
        {
          model: Country,
          as: "countries",
          attributes: ['id', 'countryName'],
          through: { attributes: [] },
        },
        {
          model: Genre,
          as: "genres",
          attributes: ['id', 'nameRu', 'nameEn'],
          through: { attributes: [] },
        },
        {
          model: Fact,
          as: "fact",
          attributes: ['id', 'value', 'type', 'spoiler'],
        },
      ],
    });

    if (!film) {
      return null;
    }

    // Группируем персон по профессиям и ограничиваем до 10 в каждой
    const professionsMap = new Map<number, TProfessionWithPersons>();
    
    if (film.persons) {
      for (const person of film.persons) {
        if (person.professions && person.professions.length > 0) {
          for (const profession of person.professions) {
            if (!professionsMap.has(profession.id)) {
              professionsMap.set(profession.id, {
                id: profession.id,
                name: profession.name,
                persons: [],
              });
            }
            
            const professionData = professionsMap.get(profession.id)!;
            // Ограничиваем до 10 персон в каждой профессии
            if (professionData.persons.length < 10) {
              const personData: TPersonBased = {
                id: person.id,
                photoUrl: person.photoUrl,
                nameRu: person.nameRu,
                nameEn: person.nameEn,
              };
              professionData.persons.push(personData);
            }
          }
        }
      }
    }

    // Преобразуем Map в массив
    const professions = Array.from(professionsMap.values());

    // Создаем объект фильма с professions вместо persons
    const filmData = film.toJSON();
    const { persons, ...filmWithoutPersons } = filmData;
    const filmWithProfessions = {
      ...filmWithoutPersons,
      professions,
    };

    const similarFilms = await this.findFilmsByGenre(
      film.genres.map((g) => g.nameRu)
    );
    return {
      film: filmWithProfessions,
      similarFilms,
    };
  }

  async findFilmsByGenre(genreNames: string[]) {
    const films = await this.filmRepository.findAll({
      include: [
        {
          model: Genre,
          where: {
            [Op.or]: [{ nameRu: genreNames }, { nameEn: genreNames }],
          },
        },
      ],
      limit: 10,
    });

    return films;
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

  async searchFilmsByName(name: string) {
    const films = await this.filmRepository.findAll({
      where: {
        [Op.or]: [
          { filmNameRu: { [Op.iLike]: `%${name}%` } },
          { filmNameEn: { [Op.iLike]: `%${name}%` } },
        ],
      },
      limit: 10,
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
  ) {
    const include: Array<{
      model: typeof Genre | typeof Country | typeof Person;
      where?: {
        [Op.or]?: Array<{ nameRu?: string[]; nameEn?: string[]; countryName?: string[] }>;
        countryName?: string[];
      };
    }> = [];
    if (genres) {
      include.push({
        model: Genre,
        where: {
          [Op.or]: [{ nameRu: genres }, { nameEn: genres }],
        },
      });
    }
    if (countries)
      include.push({ model: Country, where: { countryName: countries } });

    if (persons)
      include.push({
        model: Person,
        where: {
          [Op.or]: [{ nameRu: persons }, { nameEn: persons }],
        },
      });

    const order: [string, string][] = [];
    if (sortBy === "rating") {
      order.push(["ratingKp", "DESC"]);
    } else if (sortBy === "novelty") {
      order.push(["premiereWorldDate", "DESC"]);
    } else if (sortBy === "alphabet") {
      order.push(["filmNameRu", "ASC"]);
    } else {
      order.push(["votesKp", "DESC"]);
    }

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

    const films = await this.filmRepository.findAll({
      include,
      where,
      limit: perPage,
      offset: (page - 1) * perPage,
      order,
    });
    return films;
  }

  async getAllFilmYears(): Promise<number[]> {
    const years = await this.filmRepository.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("year")), "year"]],
      order: [[Sequelize.col("year"), "ASC"]],
    });

    return years.map((year) => year.year);
  }
}
