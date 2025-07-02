import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { MovieFromApi } from '../models/MovieFromApi.model';
import { ResponseGeneral } from '../models/ResponseGeneralApi.model';
import { Movie } from '../models/Movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private apiMovie = environment.apiMovieGeneral;
  private apiKey = environment.apiKey;
  private localApi = 'http://localhost:8080/api'; // Backend local

  constructor(
    private http: HttpClient
  ) { }

  findMovieByIdFromApi(id: number){
    return this.http.get<MovieFromApi>(this.apiMovie + '/movie/' + id + this.apiKey + '&language=pt-BR');
  }

  findVideosInfoFromMovie(id: number){
    return this.http.get<ResponseGeneral>(this.apiMovie + '/movie/' + id + '/videos' + this.apiKey);
  }

  returnLinkVideo(id: number): String{
    this.findVideosInfoFromMovie(id).subscribe(videoInfo => {
      return 'https://www.youtube.com/embed/' + videoInfo?.results[0]?.key
    });
    return ''
  }

  findListGenres(){
    return this.http.get<any>(this.apiMovie + "/genre/movie/list" + this.apiKey + '&language=pt-BR');
  }

  findListMoviesByGenre(idGenre: number){
    return this.http.get<any>(this.apiMovie + '/discover/movie' + this.apiKey + "&with_genres=" + idGenre + "&sort_by=vote_average.desc&vote_count.gte=10&language=pt-BR")
  }

  findMoviesByName(name: String){
    return this.http.get<any>(this.apiMovie + '/search/movie' + this.apiKey + '&query=' + name + '&language=pt-BR');
  }

  findMoviesPopular(){
    return this.http.get<any>(this.apiMovie + '/movie/popular' + this.apiKey + '&language=pt-BR');
  }

  findReleaseMovies(){
    return this.http.get<any>(this.apiMovie + '/movie/now_playing' + this.apiKey + '&language=pt-BR')
  }

  // Métodos para favoritos (backend local)
  async getFavoriteMovies(userId: number): Promise<Movie[]> {
    try {
      const response = await this.http.get<Movie[]>(`${this.localApi}/favorites/user/${userId}`).toPromise();
      return response || [];
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      return [];
    }
  }

  async addFavorite(userId: number, movieId: number): Promise<any> {
    const favoriteData = {
      userId: userId,
      movieId: movieId
    };
    
    try {
      return await this.http.post(`${this.localApi}/favorites/add`, favoriteData).toPromise();
    } catch (error) {
      console.error('Erro ao adicionar favorito:', error);
      throw error;
    }
  }

  async removeFavorite(userId: number, movieId: number): Promise<any> {
    const favoriteData = {
      userId: userId,
      movieId: movieId
    };
    
    try {
      return await this.http.post(`${this.localApi}/favorites/remove`, favoriteData).toPromise();
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      throw error;
    }
  }

  async checkIfFavorite(userId: number, movieId: number): Promise<boolean> {
    try {
      const response = await this.http.get<{isFavorite: boolean}>(`${this.localApi}/favorites/check/${userId}/${movieId}`).toPromise();
      return response?.isFavorite || false;
    } catch (error) {
      console.error('Erro ao verificar favorito:', error);
      return false;
    }
  }
}
