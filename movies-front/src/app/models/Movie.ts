import { Genre } from './Genre.model';

export interface Movie {
  id?: number;
  title?: string;
  description?: string;
  idAPI?: number;
  releaseDate?: string;
  posterUrl?: string;
  posterPath?: string;  // Para compatibilidade com TMDb
  genre?: string;
  rating?: number;      // Rating do filme
  voteAverage?: number; // TMDb vote_average
  overview?: string;    // Descrição do TMDb
}