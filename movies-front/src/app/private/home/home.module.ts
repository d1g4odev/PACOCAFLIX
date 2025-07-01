import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { SwiperModule } from "swiper/angular";

import { FormsModule } from '@angular/forms';
import { GenresComponent } from 'src/app/shared/genres/genres.component';
import { SearchBarComponent } from 'src/app/shared/search-bar/search-bar.component';
import { PopularMoviesComponent } from 'src/app/shared/popular-movies/popular-movies.component';
import { ReleaseMoviesComponent } from 'src/app/shared/release-movies/release-movies.component';


@NgModule({
  declarations: [
    HomeComponent, 
    GenresComponent, 
    SearchBarComponent,
    PopularMoviesComponent,
    ReleaseMoviesComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    SwiperModule,
    FormsModule
  ], 
  exports: [
    HomeComponent,
    SwiperModule
  ]
})
export class HomeModule { }
