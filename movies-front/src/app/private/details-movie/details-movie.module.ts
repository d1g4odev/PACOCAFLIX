import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsMovieComponent } from './details-movie.component';
import { DetailsMovieRoutingModule } from './details-movie-routing.module';
import { FormsModule } from '@angular/forms';
import { StarRatingComponent } from 'src/app/shared/star-rating/star-rating.component';



@NgModule({
  declarations: [
    DetailsMovieComponent,
    StarRatingComponent
  ],
  imports: [
    CommonModule,
    DetailsMovieRoutingModule,
    FormsModule
  ],
  exports: [DetailsMovieComponent]

})
export class DetailsMovieModule { }
