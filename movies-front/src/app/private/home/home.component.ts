import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { SwiperComponent } from "swiper/angular";

import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { MovieDbService } from 'src/app/services/movie-db.service';
import { AuthService } from 'src/app/services/auth.service';
import { MovieFromApi } from 'src/app/models/MovieFromApi.model';
import { Router } from '@angular/router';

// install Swiper modules
SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {
  @ViewChild("swiperRef", { static: false }) sliderRef?: SwiperComponent;

  movies: Array<any> = [];
  popularMovies: Array<any> = [];
  nowPlayingMovies: Array<any> = [];

  constructor(
    private movieDbService: MovieDbService,
    private authService: AuthService,
    private router: Router
    ) {
  }

  ngOnInit(): void {
    this.loadPopularMovies();
    this.loadNowPlayingMovies();
  }

  loadPopularMovies(): void {
    this.movieDbService.getPopularMovies().subscribe({
      next: (response) => {
        this.popularMovies = response.results.slice(0, 10); // Top 10 populares
        this.movies = this.popularMovies; // Para o slider principal
        console.log('Filmes populares carregados:', this.popularMovies);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes populares:', error);
      }
    });
  }

  loadNowPlayingMovies(): void {
    this.movieDbService.getNowPlayingMovies().subscribe({
      next: (response) => {
        this.nowPlayingMovies = response.results.slice(0, 8); // Top 8 em cartaz
        console.log('Filmes em cartaz carregados:', this.nowPlayingMovies);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes em cartaz:', error);
      }
    });
  }

  returnSrc(backdrop_path: string| undefined): string | undefined{
    if(backdrop_path != null){
      return 'url(https://image.tmdb.org/t/p/original/' + backdrop_path + ')';
    } 
    return undefined;
  }

  gotoDetails(id: number | undefined){
    this.router.navigate(["/details/", id]);
  }

  getImageUrl(posterPath: string): string {
    return this.movieDbService.getImageUrl(posterPath);
  }

  getYear(releaseDate: string): string {
    return releaseDate ? new Date(releaseDate).getFullYear().toString() : '';
  }

  getCurrentUserName(): string {
    return this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
  }

  goToFavorites(): void {
    this.router.navigate(['/favorites']);
  }

}
