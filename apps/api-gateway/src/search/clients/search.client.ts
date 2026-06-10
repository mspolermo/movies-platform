import type {
  TFilmListItemResponse,
  TPersonListItemResponse,
} from "@common/types";

import { Injectable } from "@nestjs/common";

import {
  kinoDbRpc,
  RmqService,
} from "@common/services";

@Injectable()
export class SearchClient {
  constructor(
    private readonly rmq: RmqService,
  ) {}

  searchFilmsByName(
    name: string,
  ): Promise<TFilmListItemResponse[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.films.searchFilmsByName,
      name,
    );
  }

  findPersonsByName(
    name: string,
  ): Promise<TPersonListItemResponse[]> {
    return this.rmq.sendToFilms(
      kinoDbRpc.persons.findByNameAndProfession,
      { name },
    );
  }
}