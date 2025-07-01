import { Component, OnInit, ViewChild } from '@angular/core';
import { MovieFromApi } from 'src/app/models/MovieFromApi.model';
import { MovieDbService } from 'src/app/services/movie-db.service';
import { SwiperComponent } from 'swiper/angular';
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";
import { Router } from '@angular/router';

SwiperCore.use([Autoplay, Pagination, Navigation]);

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {

  @ViewChild("swiperRef", { static: false }) sliderRef?: SwiperComponent;

  public name: String | undefined;
  
  public listMovies: Array<any> = [];

  constructor(
    private movieDbService: MovieDbService,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  searchMovie(){
    if(this.name && this.name.trim() !== ""){
      this.movieDbService.searchMovies(this.name.toString()).subscribe({
        next: (response) => {
          this.listMovies = response.results;
          console.log('Resultados da busca:', this.listMovies);
        },
        error: (error) => {
          console.error('Erro na busca:', error);
          this.listMovies = [];
        }
      });
    } else {
      this.listMovies = [];
    }
  }

  returnSrc(path: string| undefined): string | undefined{
    if(path != null){
      return 'https://image.tmdb.org/t/p/w200' + path ;
    } 
    return undefined;
  }

  getImageUrl(posterPath: string): string {
    return this.movieDbService.getImageUrl(posterPath);
  }

  gotoDetails(id: number | undefined){
    this.router.navigate(["/details/", id]);
  }
}
