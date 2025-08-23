export interface Comment {
  id: number;
  text: string;
  rating?: number;
  userId: number;
  filmId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
