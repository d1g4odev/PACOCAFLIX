import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Evaluation } from '../models/Evaluation';
import { Movie } from '../models/Movie';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieDbService {

  private apiDb = environment.apiUrl
  private tmdbUrl = environment.tmdbBaseUrl
  private tmdbKey = environment.tmdbApiKey
  private imageUrl = environment.tmdbImageBaseUrl

  constructor( private http: HttpClient) {

  }

  // Headers para TMDB API
  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.tmdbKey}`,
      'Content-Type': 'application/json'
    });
  }

  saveEvaluation( evaluation: Evaluation){
    console.log('🎬 Enviando avaliação para o backend:', evaluation);
    return this.http.post(this.apiDb + "/evaluation/save", evaluation );
  }

  saveMovie(movie: Movie){
    let rest = this.http.post(this.apiDb + "/movie/save" , movie)
    return rest; 
  }

  findEvaluations(idMovie: number | undefined | null){
    console.log('🔍 Buscando avaliações para o filme ID:', idMovie);
    return this.http.get<Array<any>>(this.apiDb + "/evaluation/findEvaluationsByMovie?idMovie=" + idMovie);
  }

  findAllEvaluations(){
    return this.http.get<Array<any>>(this.apiDb + "/evaluation/all");
  }

  findMovieByIdApi(id: number | undefined){
    return this.http.get<Array<any>>(this.apiDb + "/movie/findByIdApi?id=" + id);
  }

  // === MÉTODOS PARA API EXTERNA TMDB ===

  // Buscar filmes populares
  getPopularMovies(): Observable<any> {
    const url = `${this.tmdbUrl}/movie/popular?language=pt-BR&page=1`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Buscar filmes em cartaz
  getNowPlayingMovies(): Observable<any> {
    const url = `${this.tmdbUrl}/movie/now_playing?language=pt-BR&page=1`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Buscar filmes por texto
  searchMovies(query: string): Observable<any> {
    const url = `${this.tmdbUrl}/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=1`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Buscar filme por ID
  getMovieDetails(movieId: number): Observable<any> {
    const url = `${this.tmdbUrl}/movie/${movieId}?language=pt-BR`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Buscar gêneros
  getGenres(): Observable<any> {
    const url = `${this.tmdbUrl}/genre/movie/list?language=pt-BR`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Buscar filmes por gênero
  getMoviesByGenre(genreId: number): Observable<any> {
    const url = `${this.tmdbUrl}/discover/movie?with_genres=${genreId}&language=pt-BR&page=1`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Obter URL completa da imagem
  getImageUrl(posterPath: string): string {
    return posterPath ? `${this.imageUrl}${posterPath}` : 'assets/images/no-image.jpg';
  }

  // Buscar trailers/vídeos do filme
  getMovieVideos(movieId: number): Observable<any> {
    const url = `${this.tmdbUrl}/movie/${movieId}/videos?language=pt-BR`;
    return this.http.get(url, { headers: this.getHeaders() });
  }
}
