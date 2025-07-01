import { Genre } from './Genre.model';

export interface Movie {
  id?: number;
  title?: string;
  description?: string;
  idAPI?: number;
  releaseDate?: string;
  posterUrl?: string;
  genre?: string;
}