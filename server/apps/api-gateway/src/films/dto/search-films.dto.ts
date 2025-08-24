import { IsNumber, IsOptional, IsArray, IsString, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class SearchFilmsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 1 : parsed;
  })
  page: number = 1;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? 10 : parsed;
  })
  perPage: number = 10;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim());
    }
    return value;
  })
  genres?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim());
    }
    return value;
  })
  countries?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.split(',').map(v => v.trim());
    }
    return value;
  })
  persons?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  @Transform(({ value }) => {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  minRatingKp?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  minVotesKp?: number;

  @IsOptional()
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear())
  @Transform(({ value }) => {
    const parsed = parseInt(value);
    return isNaN(parsed) ? undefined : parsed;
  })
  year?: number;
}
