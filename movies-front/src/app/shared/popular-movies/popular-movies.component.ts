import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MovieFromApi } from 'src/app/models/MovieFromApi.model';
import { MovieDbService } from 'src/app/services/movie-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-popular-movies',
  templateUrl: './popular-movies.component.html',
  styleUrls: ['./popular-movies.component.scss']
})
export class PopularMoviesComponent implements OnInit {

  @ViewChild("swiperRef", { static: false }) sliderRef?: SwiperComponent;

  public moviesPopular: Array<any> = [];
  public favoriteStates: Map<number, boolean> = new Map();
  public favoriteLoading: boolean = false;

  constructor(
    private movieDbService: MovieDbService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.movieDbService.getPopularMovies().subscribe({
      next: (response: any) => {
        this.moviesPopular = response.results;
        console.log('Filmes populares carregados:', this.moviesPopular);
        
        // Carregar status de favoritos
        this.loadFavoriteStates();
      },
      error: (error) => {
        console.error('Erro ao carregar filmes populares:', error);
        this.moviesPopular = [];
      }
    });
  }

  // Carregar status de favoritos para todos os filmes
  loadFavoriteStates(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.moviesPopular.forEach(movie => {
      this.http.get(`http://localhost:8080/api/favorites/check/${currentUser.id}/${movie.id}`)
        .subscribe({
          next: (response: any) => {
            this.favoriteStates.set(movie.id, response.isFavorite);
          },
          error: (error) => {
            console.error('Erro ao verificar favorito:', error);
          }
        });
    });
  }

  // Verificar se filme é favorito
  isFavorited(movieId: number): boolean {
    return this.favoriteStates.get(movieId) || false;
  }

  // Toggle favorito
  toggleFavorite(movie: any): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      alert('Você precisa estar logado para adicionar favoritos!');
      return;
    }
    
    this.favoriteLoading = true;
    
    const favoriteData = {
      userId: currentUser.id,
      movieId: movie.id,
      movieData: {
        title: movie.title,
        description: movie.overview,
        idAPI: movie.id,
        releaseDate: movie.release_date,
        posterUrl: movie.poster_path,
        genre: movie.genre_ids?.[0]?.toString()
      }
    };

    this.http.post('http://localhost:8080/api/favorites/toggle', favoriteData)
      .subscribe({
        next: (response: any) => {
          this.favoriteStates.set(movie.id, response.isFavorite);
          console.log(response.message);
        },
        error: (error) => {
          console.error('Erro ao alterar favorito:', error);
          alert('Erro ao alterar favorito!');
        },
        complete: () => {
          this.favoriteLoading = false;
        }
      });
  }

  getImageUrl(posterPath: string): string {
    return this.movieDbService.getImageUrl(posterPath);
  }

  returnSrc(path: string| undefined): string | undefined{
    if(path != null){
      return 'https://image.tmdb.org/t/p/w200' + path ;
    } 
    return undefined;
  }

  gotoDetails(id: number | undefined){
    this.router.navigate(["/details/", id]);
  }
}
