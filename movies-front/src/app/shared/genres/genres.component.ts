import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Genre } from 'src/app/models/Genre.model';
import { MovieFromApi } from 'src/app/models/MovieFromApi.model';
import { MovieDbService } from 'src/app/services/movie-db.service';
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { SwiperComponent } from 'swiper/angular';

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-genres',
  templateUrl: './genres.component.html',
  styleUrls: ['./genres.component.scss']
})
export class GenresComponent implements OnInit {

  @ViewChild("swiperRef", { static: false }) sliderRef?: SwiperComponent;

  public genres: Array<any> = []

  public listMovies: Array<any> = [];

  public genrerNameChoose: String | undefined;

  constructor(
    private movieDbService: MovieDbService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.movieDbService.getGenres().subscribe({
      next: (response: any) => {
        this.genres = response.genres;
        console.log('Gêneros carregados:', this.genres);
      },
      error: (error) => {
        console.error('Erro ao carregar gêneros:', error);
        this.genres = [];
      }
    });
  }

  getMoviesByGenre(genre: any){
    this.genrerNameChoose = genre.name;
    this.movieDbService.getMoviesByGenre(genre?.id || 0).subscribe({
      next: (response: any) => {
        this.listMovies = response.results;
        console.log(`Filmes do gênero ${genre.name}:`, this.listMovies);
      },
      error: (error) => {
        console.error('Erro ao carregar filmes por gênero:', error);
        this.listMovies = [];
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
