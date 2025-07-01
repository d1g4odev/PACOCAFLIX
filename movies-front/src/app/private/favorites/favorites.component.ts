import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { MovieDbService } from 'src/app/services/movie-db.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss']
})
export class FavoritesComponent implements OnInit {
  
  public favoriteMovies: Array<any> = [];
  public loading: boolean = false;
  public error: string = '';

  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private movieDbService: MovieDbService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.get(`http://localhost:8080/api/favorites/user/${currentUser.id}`)
      .subscribe({
        next: (favorites: any) => {
          console.log('Favoritos carregados:', favorites);
          
          // Para cada favorito, buscar detalhes do filme na API TMDB
          if (favorites.length > 0) {
            this.loadMovieDetails(favorites);
          } else {
            this.favoriteMovies = [];
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('Erro ao carregar favoritos:', error);
          this.error = 'Erro ao carregar seus filmes favoritos.';
          this.loading = false;
        }
      });
  }

  loadMovieDetails(favorites: any[]): void {
    const movieDetailsPromises = favorites.map(favorite => {
      const movieId = favorite.movie?.idAPI || favorite.movie?.id;
      if (movieId) {
        return this.movieDbService.getMovieDetails(movieId).toPromise()
          .then((movieDetails: any) => {
            return {
              ...movieDetails,
              favoriteId: favorite.id,
              localMovieId: favorite.movie?.id
            };
          })
          .catch((error) => {
            console.error(`Erro ao carregar detalhes do filme ${movieId}:`, error);
            return null;
          });
      }
      return Promise.resolve(null);
    });

    Promise.all(movieDetailsPromises)
      .then((moviesDetails) => {
        this.favoriteMovies = moviesDetails.filter(movie => movie !== null);
        this.loading = false;
      })
      .catch((error) => {
        console.error('Erro ao carregar detalhes dos filmes:', error);
        this.error = 'Erro ao carregar detalhes dos filmes.';
        this.loading = false;
      });
  }

  removeFavorite(movie: any): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    // Usar o ID do banco local se disponível, senão usar o da API TMDB
    const movieIdToRemove = movie.localMovieId || movie.id;

    const favoriteData = {
      userId: currentUser.id,
      movieId: movieIdToRemove
    };

    this.http.post('http://localhost:8080/api/favorites/remove', favoriteData)
      .subscribe({
        next: (response: any) => {
          console.log('Favorito removido:', response);
          // Remover da lista local
          this.favoriteMovies = this.favoriteMovies.filter(fav => fav.id !== movie.id);
        },
        error: (error) => {
          console.error('Erro ao remover favorito:', error);
          alert('Erro ao remover dos favoritos!');
        }
      });
  }

  gotoDetails(movieId: number): void {
    this.router.navigate(['/details', movieId]);
  }

  getImageUrl(posterPath: string): string {
    return posterPath ? `https://image.tmdb.org/t/p/w300${posterPath}` : '';
  }

  getYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
} 