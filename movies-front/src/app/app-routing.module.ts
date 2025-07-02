import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'admin',
    loadChildren: () => import("./private/private.module").then(m => m.PrivateModule)
  },
  {
    path: 'login',
    loadChildren: () => import("./public/login/login.module").then(m =>m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import("./private/home/home.module").then(m => m.HomeModule)
  },
  {
    path: 'details/:id',
    loadChildren: () => import("./private/details-movie/details-movie.module").then(m => m.DetailsMovieModule)
  },
  {
    path: 'filmes-favoritos',
    loadChildren: () => import("./private/filmes-favoritos/filmes-favoritos.module").then(m => m.FilmesFavoritosModule)
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0],
      enableTracing: false
    })
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
