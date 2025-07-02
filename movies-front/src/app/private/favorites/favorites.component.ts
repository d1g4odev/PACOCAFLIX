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
    console.log('🌟 Favorites: Componente inicializando...');
    
    // Verificar autenticação logo no início
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();
    
    console.log('🔐 Favorites: Estado de autenticação:');
    console.log('  - isLoggedIn:', isLoggedIn);
    console.log('  - currentUser:', currentUser);
    console.log('  - localStorage user:', !!localStorage.getItem('user'));
    
    if (!isLoggedIn || !currentUser) {
      console.log('❌ Favorites: Usuário não autenticado, redirecionando para login');
      this.router.navigate(['/login']);
      return;
    }
    
    console.log('✅ Favorites: Usuário autenticado, carregando favoritos...');
    
    // Forçar scroll to top imediato
    this.scrollToTop();
    
    this.loadFavorites();
  }

  // Método robusto para scroll to top
  private scrollToTop(): void {
    // Scroll imediato
    window.scrollTo(0, 0);
    
    // Backup com smooth após DOM render
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 0);
    
    // Backup final para garantir
    setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo(0, 0);
      }
    }, 100);
  }

  loadFavorites(): void {
    console.log('📊 Favorites: Carregando lista de favoritos...');
    
    const currentUser = this.authService.getCurrentUser();
    const isLoggedIn = this.authService.isLoggedIn();
    
    console.log('🔍 Favorites: Verificação de usuário:');
    console.log('  - currentUser:', currentUser);
    console.log('  - isLoggedIn:', isLoggedIn);
    
    if (!currentUser || !isLoggedIn) {
      console.log('❌ Favorites: Usuário não encontrado ou não logado');
      console.log('🔄 Favorites: Redirecionando para login...');
      this.router.navigate(['/login']);
      return;
    }

    console.log(`📋 Favorites: Buscando favoritos para usuário ID: ${currentUser.id}`);
    
    this.loading = true;
    this.error = '';

    this.http.get(`http://localhost:8080/api/favorites/user/${currentUser.id}`)
      .subscribe({
        next: (favorites: any) => {
          console.log('✅ Favorites: Favoritos carregados com sucesso:', favorites);
          console.log(`📊 Favorites: Total de favoritos: ${favorites.length}`);
          
          // Para cada favorito, buscar detalhes do filme na API TMDB
          if (favorites.length > 0) {
            this.loadMovieDetails(favorites);
          } else {
            console.log('📭 Favorites: Nenhum favorito encontrado');
            this.favoriteMovies = [];
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('❌ Favorites: Erro ao carregar favoritos:', error);
          this.error = 'Erro ao carregar seus filmes favoritos.';
          this.loading = false;
          
          // Se erro 401, redirecionar para login
          if (error.status === 401) {
            console.log('🔒 Favorites: Erro 401 - redirecionando para login');
            this.authService.logout();
            this.router.navigate(['/login']);
          }
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

  gotoDetails(id: number | undefined): void {
    if (id) {
      this.router.navigate(["/details/", id]).then(() => {
        this.scrollToTop();
      });
    }
  }

  getImageUrl(posterPath: string): string {
    return posterPath ? `https://image.tmdb.org/t/p/w300${posterPath}` : '';
  }

  getYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  goToHome(): void {
    this.router.navigate(['/home']).then(() => {
      this.scrollToTop();
    });
  }
} 