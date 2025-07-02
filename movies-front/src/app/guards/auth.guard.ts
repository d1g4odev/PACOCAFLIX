import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    console.log('🔐 AuthGuard: Verificando acesso para rota:', state.url);
    
    const user = localStorage.getItem('user');
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        console.log('✅ AuthGuard: Usuário autenticado:', userData.name, 'para rota:', state.url);
        this.authService.setCurrentUser(userData);
        return true;
      } catch (error) {
        console.error('❌ AuthGuard: Erro ao parsear dados do usuário:', error);
        localStorage.removeItem('user');
      }
    }
    
    console.log('🚫 AuthGuard: Usuário não autenticado, redirecionando para login. Rota tentada:', state.url);
    this.router.navigate(['/login'], { 
      queryParams: { returnUrl: state.url }
    });
    return false;
  }
} 