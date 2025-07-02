import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
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
    loadChildren: () => import("./private/home/home.module").then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'details/:id',
    loadChildren: () => import("./private/details-movie/details-movie.module").then(m => m.DetailsMovieModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'favorites',
    loadChildren: () => import("./private/favorites/favorites.module").then(m => m.FavoritesModule),
    canActivate: [AuthGuard]
  }
];


@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      scrollOffset: [0, 0]
    })
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
