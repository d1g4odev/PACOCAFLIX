import { Movie } from './Movie';
import { User } from './User.model';

export interface Favorite {
  id?: number;
  user?: User;
  movie?: Movie;
  createdAt?: Date;
}

export interface FavoriteRequest {
  userId: number;
  movieId: number;
} 