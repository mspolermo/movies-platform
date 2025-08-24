import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { JwtConfigModule } from './jwt/jwt.module';
import { AuthModule } from './auth/auth.module';
import { FilmsModule } from './films/films.module';
import { PersonsModule } from './persons/persons.module';
import { GenresModule } from './genres/genres.module';
import { CommentsModule } from './comments/comments.module';
import { SearchModule } from './search/search.module';
import { FiltersModule } from './filters/filters.module';
import { CountriesModule } from './countries/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    JwtConfigModule,
    AuthModule,
    FilmsModule,
    PersonsModule,
    GenresModule,
    CommentsModule,
    SearchModule,
    FiltersModule,
    CountriesModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
