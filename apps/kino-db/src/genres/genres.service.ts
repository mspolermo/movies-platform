import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Genre } from "./genres.model";
import { Op } from "sequelize";
import { GenreDto } from "@common/dto";

@Injectable()
export class GenresService {
  constructor(@InjectModel(Genre) private genreRepository: typeof Genre) {}

  async getAllGenres() {
    const genres = await this.genreRepository.findAll({
      include: { all: true },
    });
    return genres;
  }

  async searchGenresByName(genreName: string) {
    const genres = await this.genreRepository.findAll({
      where: {
        [Op.or]: [
          { nameRu: { [Op.iLike]: `%${genreName}%` } },
          { nameEn: { [Op.iLike]: `%${genreName}%` } },
        ],
      },
      limit: 10,
    });
    return genres;
  }

  async updateGenre(id: number, dto: GenreDto) {
    const genre = await this.genreRepository.update(
      { nameRu: dto.nameRu, nameEn: dto.nameEn },
      { where: { id: id } }
    );
    return genre;
  }
}
