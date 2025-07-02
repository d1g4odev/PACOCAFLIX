import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieFromApi } from 'src/app/models/MovieFromApi.model';
import { MovieDbService } from 'src/app/services/movie-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { Router } from '@angular/router';

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-release-movies',
  templateUrl: './release-movies.component.html',
  styleUrls: ['./release-movies.component.scss']
})
export class ReleaseMoviesComponent implements OnInit {

  @ViewChild("swiperRef", { static: false }) sliderRef?: SwiperComponent;

  public name: String | undefined;
  public listMovies: Array<any> = [];
  public favoriteStates: Map<number, boolean> = new Map();
  public favoriteLoading: boolean = false;


  constructor(
    private movieDbService: MovieDbService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.movieDbService.getNowPlayingMovies().subscribe({
      next: (response: any) => {
        this.listMovies = response.results;
        console.log('Filmes em cartaz carregados:', this.listMovies);
        
        // Carregar estados de favoritos após carregar os filmes
        this.loadFavoriteStates();
      },
      error: (error) => {
        console.error('Erro ao carregar filmes em cartaz:', error);
        this.listMovies = [];
      }
    });
  }

  loadFavoriteStates(): void {
    const userFromStorage = localStorage.getItem('user');
    if (!userFromStorage) return;
    
    const currentUser = JSON.parse(userFromStorage);
    
    // Para cada filme, verificar se está nos favoritos
    this.listMovies.forEach(movie => {
      this.http.get<any>(`http://localhost:8080/api/favorites/check/${currentUser.id}/${movie.id}`)
        .subscribe({
          next: (response) => {
            this.favoriteStates.set(movie.id, response.isFavorite);
          },
          error: () => {
            this.favoriteStates.set(movie.id, false);
          }
        });
    });
  }

  isFavorite(movieId: number): boolean {
    return this.favoriteStates.get(movieId) || false;
  }

  toggleFavorite(movie: any): void {
    const userFromStorage = localStorage.getItem('user');
    if (!userFromStorage) {
      alert('Você precisa estar logado para adicionar favoritos!');
      return;
    }
    
    const currentUser = JSON.parse(userFromStorage);
    this.favoriteLoading = true;
    
    const favoriteData = {
      userId: currentUser.id,
      movieId: movie.id
    };

    const isCurrentlyFavorite = this.isFavorite(movie.id);
    const endpoint = isCurrentlyFavorite ? 
      'http://localhost:8080/api/favorites/remove' : 
      'http://localhost:8080/api/favorites/add';

    this.http.post<any>(endpoint, favoriteData)
      .subscribe({
        next: (response) => {
          if (response.success) {
            // Inverter o estado atual
            this.favoriteStates.set(movie.id, !isCurrentlyFavorite);
            
            // Feedback visual
            const message = !isCurrentlyFavorite ? 
              `"${movie.title}" adicionado aos favoritos!` : 
              `"${movie.title}" removido dos favoritos!`;
            console.log(message);
          } else {
            alert(response.message || 'Erro ao alterar favorito');
          }
          
          this.favoriteLoading = false;
        },
        error: (error) => {
          console.error('Erro ao alterar favorito:', error);
          alert('Erro ao alterar favorito: ' + (error.error?.message || 'Verifique se o backend está rodando'));
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
    if (id) {
      this.router.navigate(["/details/", id]).then(() => {
        // Múltiplas tentativas para garantir scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Backup imediato
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 50);
        
        // Backup final
        setTimeout(() => {
          if (window.pageYOffset > 0) {
            window.scrollTo(0, 0);
          }
        }, 200);
      });
    }
  }
}
