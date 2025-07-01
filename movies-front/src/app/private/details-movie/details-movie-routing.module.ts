import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DetailsMovieComponent } from './details-movie.component';

const routes: Routes = [{
  path: "",
  component: DetailsMovieComponent
}]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class DetailsMovieRoutingModule { }
