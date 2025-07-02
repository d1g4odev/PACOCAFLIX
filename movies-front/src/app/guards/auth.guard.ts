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
  ): boolean | Promise<boolean> {
    console.log('🔐 AuthGuard: Verificando autenticação para rota:', state.url);
    
    // Se for rota de favoritos, aguardar um pouco para garantir inicialização
    if (state.url === '/favorites') {
      console.log('⏳ AuthGuard: Rota favoritos detectada, aguardando inicialização...');
      
      return new Promise((resolve) => {
        // Dar tempo para o AuthService inicializar completamente
        setTimeout(() => {
          const result = this.checkAuthentication(state);
          console.log('🔍 AuthGuard: Resultado após delay para favoritos:', result);
          resolve(result);
        }, 200);
      });
    }
    
    // Para outras rotas, verificação normal
    return this.checkAuthentication(state);
  }
  
  private checkAuthentication(state: RouterStateSnapshot): boolean {
    const user = localStorage.getItem('user');
    const isLoggedIn = this.authService.isLoggedIn();
    const currentUser = this.authService.getCurrentUser();
    
    console.log('📊 AuthGuard Debug:');
    console.log('  - LocalStorage user:', !!user);
    console.log('  - AuthService isLoggedIn:', isLoggedIn);
    console.log('  - AuthService getCurrentUser:', !!currentUser);
    console.log('  - Rota tentando acessar:', state.url);
    
    // Verificação mais robusta para favoritos
    if (state.url === '/favorites') {
      console.log('🔍 AuthGuard: Verificação especial para favoritos:');
      console.log('    - localStorage.user existe:', !!user);
      console.log('    - AuthService.isLoggedIn():', isLoggedIn);
      console.log('    - AuthService.getCurrentUser():', !!currentUser);
      
      // Se tem usuário no localStorage mas AuthService não reconhece,
      // tentar reinicializar o AuthService
      if (user && !currentUser) {
        console.log('🔄 AuthGuard: Tentando reinicializar AuthService...');
        try {
          const userData = JSON.parse(user);
          this.authService.setCurrentUser(userData);
          const recheckLoggedIn = this.authService.isLoggedIn();
          console.log('🔍 AuthGuard: Após reinicialização - isLoggedIn:', recheckLoggedIn);
          
          if (recheckLoggedIn) {
            console.log('✅ AuthGuard: Reinicialização bem-sucedida para favoritos');
            return true;
          }
        } catch (error) {
          console.error('❌ AuthGuard: Erro na reinicialização:', error);
        }
      }
    }
    
    if (user && isLoggedIn && currentUser) {
      console.log('✅ AuthGuard: Usuário autenticado, permitindo acesso a:', state.url);
      return true;
    } else {
      console.log('❌ AuthGuard: Usuário não autenticado');
      console.log('🔄 Redirecionando de:', state.url, 'para: /login');
      
      // Adicionar log especial para rota de favoritos
      if (state.url === '/favorites') {
        console.log('⚠️ AuthGuard: PROBLEMA - Tentativa de acesso a /favorites negada');
        console.log('🔍 AuthGuard: Estado final:');
        console.log('    - localStorage.user existe:', !!user);
        console.log('    - AuthService.isLoggedIn():', isLoggedIn);
        console.log('    - AuthService.getCurrentUser():', !!currentUser);
      }
      
      // Limpar dados inconsistentes apenas se realmente não há usuário
      if (!user) {
        localStorage.removeItem('user');
        this.authService.logout();
      }
      
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url }
      });
      return false;
    }
  }
} 