import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { MovieService } from '../../services/movie.service';
import { Movie } from '../../models/Movie';

@Component({
  selector: 'app-filmes-favoritos',
  templateUrl: './filmes-favoritos.component.html',
  styleUrls: ['./filmes-favoritos.component.scss']
})
export class FilmesFavoritosComponent implements OnInit {
  favoriteMovies: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService,
    private movieService: MovieService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  async loadFavorites(): Promise<void> {
    this.isLoading = true;
    this.error = null;

    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        console.warn('Usuário não encontrado, redirecionando para login');
        this.router.navigate(['/login']);
        return;
      }

      console.log('🎬 FAVORITOS: Carregando favoritos para usuário:', user.id);
      
      // Buscar favoritos do backend
      const favorites = await this.http.get<any[]>(`http://localhost:8080/api/favorites/user/${user.id}`).toPromise();
      console.log('✅ FAVORITOS: Dados recebidos da API:', favorites);

      if (favorites && favorites.length > 0) {
        await this.loadMovieDetailsFromFavorites(favorites);
      } else {
        this.favoriteMovies = [];
        console.log('📝 FAVORITOS: Nenhum favorito encontrado');
      }

    } catch (error) {
      console.error('❌ FAVORITOS: Erro ao carregar favoritos:', error);
      this.error = 'Erro ao carregar seus filmes favoritos. Tente novamente.';
      this.favoriteMovies = [];
    } finally {
      this.isLoading = false;
    }
  }

  private async loadMovieDetailsFromFavorites(favorites: any[]): Promise<void> {
    console.log('🎭 FAVORITOS: Carregando detalhes dos filmes favoritos...');
    
    const movieDetailsPromises = favorites.map(async (favorite) => {
      const movieId = favorite.movie?.idAPI || favorite.movie?.id;
      
      if (movieId) {
        try {
          const movieDetails = await this.http.get<any>(`https://api.themoviedb.org/3/movie/${movieId}?api_key=e5773530e7e66ca9984fa59dd68db15f&language=pt-BR`).toPromise();
          return {
            ...movieDetails,
            favoriteId: favorite.id,
            localMovieId: favorite.movie?.id,
            dbMovie: favorite.movie // Dados do banco local
          };
        } catch (error) {
          console.error('Erro ao carregar detalhes do filme:', movieId, error);
          return null;
        }
      }
      return null;
    });

    try {
      const moviesDetails = await Promise.all(movieDetailsPromises);
      this.favoriteMovies = moviesDetails.filter(movie => movie !== null);
      console.log('✅ FAVORITOS: Filmes favoritos carregados:', this.favoriteMovies.length, 'filmes');
    } catch (error) {
      console.error('❌ FAVORITOS: Erro ao carregar detalhes dos filmes:', error);
      this.error = 'Erro ao carregar detalhes dos filmes favoritos.';
    }
  }

  async removeFavorite(movie: any, event?: Event): Promise<void> {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      const user = this.authService.getCurrentUser();
      if (!user) {
        console.warn('Usuário não encontrado');
        return;
      }

      const movieIdToRemove = movie.dbMovie?.idAPI || movie.id;
      console.log('Removendo favorito:', movieIdToRemove);
      
      // Remover do backend
      await this.movieService.removeFavorite(user.id, movieIdToRemove);
      
      // Remover da lista local
      this.favoriteMovies = this.favoriteMovies.filter(fav => fav.id !== movie.id);
      
      console.log('✅ FAVORITO REMOVIDO:', movie.title);

    } catch (error) {
      console.error('❌ Erro ao remover favorito:', error);
      // Recarregar lista em caso de erro
      this.loadFavorites();
    }
  }

  openMovieDetails(movieId: number): void {
    console.log('🎬 FAVORITOS: Abrindo detalhes do filme ID:', movieId);
    console.log('🧭 FAVORITOS: Rota atual:', this.router.url);
    console.log('🎯 FAVORITOS: Navegando para /details/' + movieId);
    
    this.router.navigate(['/details', movieId]).then((success) => {
      if (success) {
        console.log('✅ FAVORITOS: Navegação bem-sucedida para /details/' + movieId);
      } else {
        console.warn('⚠️ FAVORITOS: Navegação falhou para /details/' + movieId);
      }
    }).catch((error) => {
      console.error('❌ FAVORITOS: Erro na navegação:', error);
    });
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  // Obter URL do poster de forma segura
  getMoviePosterUrl(movie: any): string {
    if (movie.poster_path) {
      return `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
    }
    return 'assets/images/pluto.jpg'; // Imagem padrão
  }

  // Método para calcular estrelas (máximo 5) - baseado no vote_average do TMDb
  getStarsArray(movie: any): boolean[] {
    const rating = movie.vote_average || 0;
    // Normalizar de 0-10 para 0-5
    const normalizedRating = Math.round((rating / 10) * 5);
    const stars: boolean[] = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= normalizedRating);
    }
    
    return stars;
  }

  // Obter rating para exibição (sempre em escala 0-5)
  getDisplayRating(movie: any): string {
    const rating = movie.vote_average || 0;
    const normalizedRating = Math.round((rating / 10) * 5);
    return `${normalizedRating}/5`;
  }

  // Obter ano do filme
  getMovieYear(releaseDate: string): string {
    if (!releaseDate) return 'N/A';
    return new Date(releaseDate).getFullYear().toString();
  }

  // TrackBy para performance
  trackByMovieId(index: number, movie: any): number {
    return movie.id || index;
  }

  // Tratamento de erro de imagem
  onImageError(event: any): void {
    event.target.src = 'assets/images/pluto.jpg'; // Imagem padrão
  }
} 