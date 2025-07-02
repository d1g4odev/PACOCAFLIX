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
        
        // Carregar status de favoritos
        this.loadFavoriteStates();
      },
      error: (error) => {
        console.error('Erro ao carregar filmes em cartaz:', error);
        this.listMovies = [];
      }
    });
  }

  // Carregar status de favoritos para todos os filmes
  loadFavoriteStates(): void {
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser) return;

    this.listMovies.forEach(movie => {
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
