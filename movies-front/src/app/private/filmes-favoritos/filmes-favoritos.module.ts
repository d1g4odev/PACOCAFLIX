import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { FilmesFavoritosComponent } from './filmes-favoritos.component';
import { FilmesFavoritosRoutingModule } from './filmes-favoritos-routing.module';

@NgModule({
  declarations: [
    FilmesFavoritosComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FilmesFavoritosRoutingModule
  ]
})
export class FilmesFavoritosModule { } 