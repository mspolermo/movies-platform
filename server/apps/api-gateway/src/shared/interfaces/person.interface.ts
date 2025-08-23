export interface Person {
  id: number;
  nameRu: string;
  nameEn: string;
  birthDate?: Date;
  deathDate?: Date;
  photoUrl?: string;
  biography?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
