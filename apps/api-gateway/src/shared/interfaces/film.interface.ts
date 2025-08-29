export interface Film {
  id: number;
  filmNameRu: string;
  filmNameEn: string;
  year?: number;
  ratingKp?: number;
  votesKp?: number;
  description?: string;
  posterUrl?: string;
  trailerUrl?: string;
  duration?: number;
  createdAt?: Date;
  updatedAt?: Date;
}
