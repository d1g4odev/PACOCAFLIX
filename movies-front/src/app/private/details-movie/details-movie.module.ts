import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailsMovieComponent } from './details-movie.component';
import { DetailsMovieRoutingModule } from './details-movie-routing.module';
import { FormsModule } from '@angular/forms';
// Removido SharedModule - StarRatingComponent será usado inline



@NgModule({
  declarations: [
    DetailsMovieComponent
  ],
  imports: [
    CommonModule,
    DetailsMovieRoutingModule,
    FormsModule
  ],
  exports: [DetailsMovieComponent]

})
export class DetailsMovieModule { }
