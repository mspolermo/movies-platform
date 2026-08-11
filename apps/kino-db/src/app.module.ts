import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { SequelizeModule } from "@nestjs/sequelize";

import { NETWORK } from "@common/constants/network";
import { assertPostgresCredentialsForProduction } from "@common/services/rmq/rmq.constants";

import { Comment, CommentLike, CommentsModule } from "./comments";
import { Country, CountriesModule } from "./countries";
import { Film, FilmsModule, FilmPerson, FilmGenre, FilmCountry, Fact } from "./films";
import { Genre, GenresModule } from "./genres";
import { HealthController } from "./health";
import { Person, PersonProfession, PersonsModule } from "./persons";
import { Profession, ProfessionsModule } from "./professions";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
    }),
    SequelizeModule.forRootAsync({
      useFactory: () => {
        const username = (process.env.POSTGRES_USER || "").trim() || undefined;
        const password =
          (process.env.POSTGRES_PASSWORD || "").trim() || undefined;
        assertPostgresCredentialsForProduction(
          username,
          password,
          process.env.NODE_ENV
        );

        return {
          dialect: "postgres" as const,
          host: process.env.POSTGRES_HOST,
          port: Number(process.env.POSTGRES_PORT) || NETWORK.postgresDialPort,
          username,
          password,
          database: process.env.POSTGRES_DB,
          models: [
            Genre,
            Fact,
            Country,
            Film,
            Person,
            Profession,
            FilmGenre,
            FilmCountry,
            FilmPerson,
            PersonProfession,
            Comment,
            CommentLike,
          ],
          autoLoadModels: true,
          synchronize: true,
        };
      },
    }),
    GenresModule,
    CountriesModule,
    ProfessionsModule,
    PersonsModule,
    FilmsModule,
    CommentsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
