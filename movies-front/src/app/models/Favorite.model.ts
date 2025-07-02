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

export interface FavoriteResponse {
  success: boolean;
  message: string;
  favorite?: Favorite;
}

export interface FavoriteCheckResponse {
  isFavorite: boolean;
  userId: number;
  movieId: number;
}

export interface FavoriteToggleResponse {
  isFavorite: boolean;
  message: string;
} 