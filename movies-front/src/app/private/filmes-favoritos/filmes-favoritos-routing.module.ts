import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FilmesFavoritosComponent } from './filmes-favoritos.component';

const routes: Routes = [
  {
    path: '',
    component: FilmesFavoritosComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FilmesFavoritosRoutingModule { } 