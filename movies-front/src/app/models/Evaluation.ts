import { Movie } from './Movie';
import { User } from './User.model';

export interface Evaluation {
  id?: number;
  name?: string; // Para compatibilidade
  authorName?: string; // Nome do autor da avaliação
  comment?: string;
  rating?: number; // 1 a 5 estrelas
  score?: number; // Para compatibilidade com backend
  createdAt?: Date;
  movie?: Movie;
  user?: User;
  movieId?: number;
  userId?: number;
}